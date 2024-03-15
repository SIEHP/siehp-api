import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { ExampleEnum } from 'src/shared/domain/dtos/requests/GetExample.request.dto';
import { ExampleException } from 'src/shared/domain/errors/Example.exception';
import { Enviroment } from 'src/shared/config/app';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';
import { AllExceptionsFilter } from 'src/shared/domain/errors/AllException.filter';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';
import { ZodValidationExceptionFilter } from 'src/shared/domain/errors/ZodValidationException.filter';
import { HttpException } from '@nestjs/common';

describe('ExampleController - /example', () => {
  const controllerRoute = '/example';

  let app: NestExpressApplication;
  let prisma: PrismaProvider;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
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

  describe('POST /', () => {
    const route = `${controllerRoute}/`;

    it('should throw error if id not sent', async () => {
      const data = {
        sex: ExampleEnum.FEMALE,
      };

      const response = await request(app.getHttpServer())
        .post(route)
        .send(data)
        .set('Accept', 'application/json');

      const expectedError = new HttpException('id Required', 422);

      expect(response.status).toEqual(expectedError.getStatus());
      expect(response.body?.message).toEqual(expectedError.message);
    });

    it('should throw error if sex female', async () => {
      const data = {
        id: 1,
        sex: ExampleEnum.FEMALE,
      };

      const response = await request(app.getHttpServer())
        .post(route)
        .send(data)
        .set('Accept', 'application/json');

      const expectedError = new ExampleException();

      expect(response.status).toEqual(expectedError.getStatus());
      expect(response.body?.message).toEqual(expectedError.message);
    });

    it('should return example', async () => {
      const data = {
        id: 1,
        sex: ExampleEnum.MALE,
      };

      const expectedResult = {
        example: {
          id: 1,
        },
      };

      const response = await request(app.getHttpServer())
        .post(route)
        .send(data)
        .set('Accept', 'application/json');

      expect(response.body).toStrictEqual(expectedResult);
    });
  });
});
