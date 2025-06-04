import * as request from 'supertest';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { Enviroment } from 'src/shared/config/app';
import { AllExceptionsFilter } from 'src/shared/infra/filters/AllException.filter';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';
import { ZodValidationExceptionFilter } from 'src/shared/infra/filters/ZodValidationException.filter';
import { UserModule } from '../../modules/User.module';
import { NotFoundUserException } from 'src/modules/user/infra/exceptions/NotFoundUser.exception';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';
import { LoginBodySchema } from 'src/modules/user/infra/requests/Login.request/dto';
import { ZodError } from 'zod';
import { ValidationException } from 'src/shared/infra/exceptions/Validation.exception';
import { InvalidPermissionsException } from 'src/modules/user/infra/exceptions/InvalidPermissions.exception';
import { userSeeder } from '../../db/prisma/seeders/user';
import { LoggerProvider } from 'src/shared/infra/providers/Logger.provider';
import { UserController } from './User.controller';
import { LoginUseCase } from '../../usecases/Login.usecase';
import { UserService } from '../../services/User.service';
import { EmailProvider } from '../../../../../shared/infra/providers/Email.provider';
import { TokenProvider } from '../../providers/Token.provider';
import { Response } from 'express';
import { Role, Status } from '@prisma/client';

describe('UserController - /user', () => {
  const controllerRoute = '/user';
  const loginRoute = `${controllerRoute}/login`;
  // TODO: Add missing routes and remove any mock data

  let app: NestExpressApplication;
  let prisma: PrismaProvider;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtToken: string;
  let controller: UserController;
  let loginUseCase: LoginUseCase;
  let userService: UserService;
  let emailProvider: EmailProvider;
  let tokenProvider: TokenProvider;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UserModule, SharedModule],
    })
      .overrideProvider(PrismaProvider)
      .useValue(new PrismaProvider(Enviroment.TEST))
      .compile();

    prisma = moduleRef.get(PrismaProvider);
    controller = moduleRef.get(UserController);
    loginUseCase = moduleRef.get(LoginUseCase);
    userService = moduleRef.get(UserService);
    emailProvider = moduleRef.get(EmailProvider);
    tokenProvider = moduleRef.get(TokenProvider);

    const logger = new LoggerProvider(
      new DiscordWebhookProvider(Enviroment.TEST),
    );

    app = moduleRef.createNestApplication<NestExpressApplication>();
    app.useGlobalFilters(
      new AllExceptionsFilter(logger),
      new ZodValidationExceptionFilter(logger),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.seed([userSeeder]);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prisma.clear('all');
  });

  describe('POST /login', () => {
    it('should throw error if email or password is unprocessable', async () => {
      const wrongEmail = 'test1email.com';
      const longPassword = 'a'.repeat(101);

      const loginDto = {
        email: wrongEmail,
        password: longPassword,
      };

      let expectedError: HttpException | undefined;

      try {
        LoginBodySchema.parse(loginDto);
      } catch (error) {
        if (error instanceof ZodError) {
          expectedError = new ValidationException(error);
        }
      }

      const response = await request(app.getHttpServer())
        .post(loginRoute)
        .send(loginDto)
        .set('Accept', 'application/json');

      expect(response.status).toBe(expectedError.getStatus());
      expect(response.body?.message).toEqual(expectedError.message);
    });

    it('should return error if user not found', async () => {
      const loginDto = {
        email: 'test2@email.com',
        password: 'Coxinh@123',
      };

      const response = await request(app.getHttpServer())
        .post(loginRoute)
        .send(loginDto)
        .set('Accept', 'application/json');

      const expectedError = new NotFoundUserException();

      expect(response.status).toEqual(expectedError.getStatus());
      expect(response.body?.message).toEqual(expectedError.message);
    });
  });

  it('should return a JWT token for valid credentials', async () => {
    const loginDto = {
      email: 'test1@email.com',
      password: 'Coxinh@123',
    };

    jest.spyOn(loginUseCase, 'execute').mockResolvedValue({
      access_token: 'mock-jwt-token',
    });

    await controller.login(loginDto, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    );

    jwtToken = (mockResponse.json as jest.Mock).mock.calls[0][0].access_token;
  });

  describe('inviteProfessor', () => {
    it('should create temp user and send invite token', async () => {
      const mockRequest = {
        user: { email: 'admin@example.com' },
      };

      const mockTempUser = {
        id: 123,
        email: 'professor@example.com',
        name: 'professor',
        password: '',
        registration_code: '123456',
        role: Role.PROFESSOR,
        status: Status.INACTIVE,
      };

      jest.spyOn(userService, 'checkUserPermissions').mockResolvedValue({
        hasPermission: true,
        notIncludedPermissions: [],
      });

      jest.spyOn(userService, 'createTempUser').mockResolvedValue(mockTempUser);
      jest.spyOn(tokenProvider, 'sendToken').mockResolvedValue();

      await controller.inviteProfessor(
        { email: 'professor@example.com' },
        mockRequest as any,
        mockResponse,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Convite enviado com sucesso',
      });

      expect(userService.checkUserPermissions).toHaveBeenCalledWith({
        user_email: 'admin@example.com',
        neededPermissions: ['MANTER_PROFESSORES'],
      });

      expect(userService.createTempUser).toHaveBeenCalledWith({
        email: 'professor@example.com',
        role: Role.PROFESSOR,
      });

      expect(tokenProvider.sendToken).toHaveBeenCalledWith({
        email: 'professor@example.com',
        userId: mockTempUser.id,
      });
    });

    it('should throw error if user does not have admin permission', async () => {
      const mockRequest = {
        user: { email: 'user@example.com' },
      };

      jest.spyOn(userService, 'checkUserPermissions').mockResolvedValue({
        hasPermission: false,
        notIncludedPermissions: ['MANTER_PROFESSORES'],
      });

      const expectedError = new InvalidPermissionsException({
        permissions: ['MANTER_PROFESSORES'],
      });

      try {
        await controller.inviteProfessor(
          { email: 'professor@example.com' },
          mockRequest as any,
          mockResponse,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidPermissionsException);
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
        expect(error.message).toBe(expectedError.message);
      }
    });
  });

  describe('validateToken', () => {
    it('should validate token and create user account', async () => {
      const mockTokenData = {
        id: 1,
        token: 'valid-token',
        user_id: 123,
        created_at: new Date(),
        expires_at: new Date(Date.now() + 3600000),
        is_used: false,
        user: {
          id: 123,
          name: 'professor',
          email: 'professor@example.com',
          password: '',
          registration_code: '123456',
          role: 'PROFESSOR' as Role,
          status: 'PENDING' as Status,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 1,
          updated_by: 1,
        },
      };

      jest
        .spyOn(tokenProvider, 'getTokenData')
        .mockResolvedValue(mockTokenData);
      jest.spyOn(userService, 'activateUser').mockResolvedValue();
      jest.spyOn(tokenProvider, 'invalidateToken').mockResolvedValue();
      jest.spyOn(emailProvider, 'send').mockResolvedValue();

      await controller.validateToken(
        { token: 'valid-token', password: 'password123' },
        mockResponse,
      );

      expect(tokenProvider.getTokenData).toHaveBeenCalledWith('valid-token');
      expect(userService.activateUser).toHaveBeenCalledWith({
        userId: 123,
        password: 'password123',
      });
      expect(tokenProvider.invalidateToken).toHaveBeenCalledWith('valid-token');
      expect(emailProvider.send).toHaveBeenCalled();

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Conta criada com sucesso',
      });
    });

    it('should return error for invalid token', async () => {
      jest.spyOn(tokenProvider, 'getTokenData').mockResolvedValue(null);

      const mockRequest = {
        token: 'invalid-token',
        password: 'password123',
      };

      await controller.validateToken(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token inválido ou expirado.',
      });
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
    });

    it('should return error for expired token', async () => {
      const mockTokenData = {
        id: 1,
        token: 'expired-token',
        user_id: 123,
        created_at: new Date(),
        expires_at: new Date(Date.now() - 3600000),
        is_used: false,
        user: {
          id: 123,
          name: 'professor',
          email: 'professor@example.com',
          password: '',
          registration_code: '123456',
          role: 'PROFESSOR' as Role,
          status: 'PENDING' as Status,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 1,
          updated_by: 1,
        },
      };

      jest
        .spyOn(tokenProvider, 'getTokenData')
        .mockResolvedValue(mockTokenData);

      await controller.validateToken(
        { token: 'expired-token', password: 'password123' },
        mockResponse,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token inválido ou expirado.',
      });
    });

    it('should return error for used token', async () => {
      const mockTokenData = {
        id: 1,
        token: 'expired-token',
        user_id: 123,
        created_at: new Date(),
        expires_at: new Date(Date.now() + 3600000),
        is_used: true,
        user: {
          id: 123,
          name: 'professor',
          email: 'professor@example.com',
          password: '',
          registration_code: '123456',
          role: 'PROFESSOR' as Role,
          status: 'PENDING' as Status,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 1,
          updated_by: 1,
        },
      };

      jest
        .spyOn(tokenProvider, 'getTokenData')
        .mockResolvedValue(mockTokenData);

      const mockRequest = {
        token: 'used-token',
        password: 'password123',
      };

      await controller.validateToken(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Esse token já foi utilizado.',
      });
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
    });
  });
});
