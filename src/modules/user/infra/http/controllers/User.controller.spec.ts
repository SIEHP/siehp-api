import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
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

describe('UserController - /user', () => {
  const controllerRoute = '/user';

  let app: NestExpressApplication;
  let prisma: PrismaProvider;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(PrismaProvider)
      .useValue(new PrismaProvider(Enviroment.TEST))
      .compile();

    prisma = moduleRef.get(PrismaProvider);

    app = moduleRef.createNestApplication<NestExpressApplication>();
    app.useGlobalFilters(
      new AllExceptionsFilter(new DiscordWebhookProvider(Enviroment.TEST)),
      new ZodValidationExceptionFilter(),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.seed();
  });

  afterEach(async () => {
    await prisma.clear();
  });

  describe('POST /login', () => {
    const loginRoute = `${controllerRoute}/login`;

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
      expect(response.body).toHaveProperty('user_id');
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
    const testRoute = `${controllerRoute}/teste`;

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
  });
});
