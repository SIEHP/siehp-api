import * as request from 'supertest';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { Enviroment } from 'src/shared/config/app';
import { AllExceptionsFilter } from 'src/shared/domain/errors/AllException.filter';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';
import { ZodValidationExceptionFilter } from 'src/shared/domain/errors/ZodValidationException.filter';
import { UserModule } from '../../modules/User.module';
import { NotFoundUserException } from 'src/modules/user/domain/errors/NotFoundUser.exception';
import { UnauthorizedException } from 'src/modules/user/domain/errors/Unauthorized.exception';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';
import { LoginBodySchema } from 'src/modules/user/domain/dtos/requests/Login.request.dto';
import { ZodError } from 'zod';
import { ValidationException } from 'src/shared/domain/errors/Validation.exception';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { userSeeder } from '../../db/prisma/seeders/user';
import { SALT } from '../../utils/constants';
import * as bcrypt from 'bcrypt';
import { LoggerProvider } from 'src/shared/infra/providers/Logger.provider';

describe('UserController - /user', () => {
  const controllerRoute = '/user';
  const loginRoute = `${controllerRoute}/login`;
  const testRoute = `${controllerRoute}/teste`;

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
      expect(response.body).toHaveProperty('access_token');
      jwtToken = response.body.access_token;
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

  describe('GET /teste', () => {
    it('should return user info for valid JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get(testRoute)
        .set('Authorization', `Bearer ${jwtToken}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('user');
    });

    it('should return 401 for missing JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get(testRoute)
        .set('Accept', 'application/json');

      const expectedError = new UnauthorizedException();

      expect(response.status).toEqual(expectedError.getStatus());
      expect(response.body?.message).toEqual(expectedError.message);
    });

    it('should throw forbidden when user dont have permission', async () => {
      const salt = await bcrypt.genSalt(SALT);

      const email = 'test2@email.com';
      const password = 'Coxinh@1234';
      const hashPassword = await bcrypt.hash(password, salt);

      await prisma.user.create({
        data: {
          email,
          name: 'test2',
          password: hashPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
          registration_code: '1234567',
        },
      });

      const loginDto = {
        email,
        password,
      };

      const loginResponse = await request(app.getHttpServer())
        .post(loginRoute)
        .send(loginDto)
        .set('Accept', 'application/json');

      const newUserAcessToken = loginResponse.body.access_token;

      const response = await request(app.getHttpServer())
        .get(testRoute)
        .set('Authorization', `Bearer ${newUserAcessToken}`)
        .set('Accept', 'application/json');

      const expectedError = new InvalidPermissionsException({
        permissions: ['ACESSAR_LOGS'],
      });

      expect(response.status).toEqual(expectedError.getStatus());
      expect(response.body?.message).toEqual(expectedError.message);
    });
  });
});
