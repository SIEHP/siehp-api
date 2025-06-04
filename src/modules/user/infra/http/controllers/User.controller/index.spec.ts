import * as request from 'supertest';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { Enviroment } from 'src/shared/config/app';
import { AllExceptionsFilter } from 'src/shared/infra/filters/AllException.filter';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';
import { ZodValidationExceptionFilter } from 'src/shared/infra/filters/ZodValidationException.filter';
import { UserModule } from '../../../modules/User.module';
import { NotFoundUserException } from 'src/modules/user/infra/exceptions/NotFoundUser.exception';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';
import { LoginBodySchema } from 'src/modules/user/infra/requests/Login.request/dto';
import { ZodError } from 'zod';
import { ValidationException } from 'src/shared/infra/exceptions/Validation.exception';
import { InvalidPermissionsException } from 'src/modules/user/infra/exceptions/InvalidPermissions.exception';
import { userSeeder } from '../../../db/prisma/seeders/user';
import { LoggerProvider } from 'src/shared/infra/providers/Logger.provider';
import { InvalidTokenException } from '../../../exceptions/InvalidToken.exception';
import { AlreadyUsedTokenException } from '../../../exceptions/AlreadyUsedToken.exception';
import { ValidateTokenBodyDTO } from '../../../requests/ValidateToken.request/dto';

describe('UserController - /user', () => {
  const controllerRoute = '/user';
  const loginRoute = `${controllerRoute}/login`;
  const inviteProfessorRoute = `${controllerRoute}/invite/professor`;
  const validateTokenRoute = `${controllerRoute}/validate-token`;

  let app: NestExpressApplication;
  let prisma: PrismaProvider;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UserModule, SharedModule],
    })
      .overrideProvider(PrismaProvider)
      .useValue(new PrismaProvider(Enviroment.TEST))
      .compile();

    prisma = moduleRef.get(PrismaProvider);

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

    it('should return a JWT token for valid credentials', async () => {
      const loginDto = {
        email: 'test1@email.com',
        password: 'Coxinh@123',
      };

      const response = await request(app.getHttpServer())
        .post(loginRoute)
        .send(loginDto)
        .set('Accept', 'application/json');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          access_token: expect.any(String),
        }),
      );

      jwtToken = response.body.access_token;
    });
  });

  describe('POST /invite/professor', () => {
    it('should create temp user and send invite token', async () => {
      const inviteDto = {
        email: 'professor@example.com',
      };

      const response = await request(app.getHttpServer())
        .post(inviteProfessorRoute)
        .send(inviteDto)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        message: 'Professor convidado com sucesso',
      });
    });

    it('should throw error if user does not have admin permission', async () => {
      const user = await prisma.user.findFirst({
        where: {
          email: 'test1@email.com',
        },
      });

      const permission = await prisma.permission.findFirst({
        where: {
          name: 'MANTER_PROFESSORES',
        },
      });

      await prisma.userPermission.delete({
        where: {
          user_id_permission_id: {
            user_id: user.id,
            permission_id: permission.id,
          },
        },
      });

      const nonAdminLoginDto = {
        email: 'test1@email.com',
        password: 'Coxinh@123',
      };

      const loginResponse = await request(app.getHttpServer())
        .post(loginRoute)
        .send(nonAdminLoginDto)
        .set('Accept', 'application/json');

      const nonAdminToken = loginResponse.body.access_token;

      const inviteDto = {
        email: 'professor@example.com',
      };

      const response = await request(app.getHttpServer())
        .post(inviteProfessorRoute)
        .send(inviteDto)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${nonAdminToken}`);

      const expectedError = new InvalidPermissionsException({
        permissions: ['MANTER_PROFESSORES'],
      });

      expect(response.status).toBe(expectedError.getStatus());
      expect(response.body.message).toBe(expectedError.message);
    });
  });

  describe('POST /validate-token', () => {
    it('should validate token and create user account', async () => {
      const inviteDto = {
        email: 'professor@example.com',
      };

      await request(app.getHttpServer())
        .post(inviteProfessorRoute)
        .send(inviteDto)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwtToken}`);

      const token = await prisma.token.findFirst();

      const validateDto: ValidateTokenBodyDTO = {
        token: token.token,
        password: '@Coxinha123',
        confirmPassword: '@Coxinha123',
      };

      const response = await request(app.getHttpServer())
        .post(validateTokenRoute)
        .send(validateDto)
        .set('Accept', 'application/json');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        message: 'Conta criada com sucesso',
      });
    });

    it('should return error for invalid token', async () => {
      const inviteDto = {
        email: 'professor@example.com',
      };

      await request(app.getHttpServer())
        .post(inviteProfessorRoute)
        .send(inviteDto)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwtToken}`);

      const token = await prisma.token.findFirst();

      await prisma.token.delete({
        where: {
          token: token.token,
        },
      });

      const validateDto = {
        token: token.token,
        password: '@Coxinha123',
        confirmPassword: '@Coxinha123',
      };

      const response = await request(app.getHttpServer())
        .post(validateTokenRoute)
        .send(validateDto)
        .set('Accept', 'application/json');

      const expectedError = new InvalidTokenException();

      expect(response.status).toBe(expectedError.getStatus());
      expect(response.body.message).toBe(expectedError.message);
    });

    it('should return error for expired token', async () => {
      const inviteDto = {
        email: 'professor@example.com',
      };

      await request(app.getHttpServer())
        .post(inviteProfessorRoute)
        .send(inviteDto)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwtToken}`);

      const token = await prisma.token.findFirst();

      await prisma.token.update({
        where: {
          token: token.token,
        },
        data: {
          expires_at: new Date(Date.now() - 1000),
        },
      });

      const validateDto = {
        token: token.token,
        password: '@Coxinha123',
        confirmPassword: '@Coxinha123',
      };

      const response = await request(app.getHttpServer())
        .post(validateTokenRoute)
        .send(validateDto)
        .set('Accept', 'application/json');

      const expectedError = new InvalidTokenException();

      expect(response.status).toBe(expectedError.getStatus());
      expect(response.body.message).toBe(expectedError.message);
    });

    it('should return error for used token', async () => {
      const inviteDto = {
        email: 'professor@example.com',
      };

      await request(app.getHttpServer())
        .post(inviteProfessorRoute)
        .send(inviteDto)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwtToken}`);

      const token = await prisma.token.findFirst();

      await prisma.token.update({
        where: {
          token: token.token,
        },
        data: {
          is_used: true,
        },
      });

      const validateDto = {
        token: token.token,
        password: '@Coxinha123',
        confirmPassword: '@Coxinha123',
      };

      const response = await request(app.getHttpServer())
        .post(validateTokenRoute)
        .send(validateDto)
        .set('Accept', 'application/json');

      const expectedError = new AlreadyUsedTokenException();

      expect(response.status).toBe(expectedError.getStatus());
      expect(response.body.message).toBe(expectedError.message);
    });
  });
});
