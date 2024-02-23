import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ExampleController } from '../http/controllers/Example.controller';
import { ExampleRepository } from '../db/repositories/Example.repository';
import { GetExampleUseCase } from '../usecases/GetExample/GetExample.usecase';
import { ExampleMiddleware } from '../http/middlewares/Example.middleware';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { PrismaProvider } from '../db/prisma/providers/Prisma.provider';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [ExampleController],
  providers: [
    ExampleRepository,
    GetExampleUseCase,
    PrismaProvider,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  exports: [ExampleRepository, GetExampleUseCase, PrismaProvider],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExampleMiddleware).forRoutes({
      path: 'example',
      method: RequestMethod.GET,
    });
  }
}
