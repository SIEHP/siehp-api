import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ExampleController } from '../http/controllers/Example.controller';
import { ExampleRepository } from '../db/repositories/Example.repository';
import { GetExampleUseCase } from '../usecases/GetExample.usecase';
import { ExampleMiddleware } from '../http/middlewares/Example.middleware';

@Module({
  imports: [],
  controllers: [ExampleController],
  providers: [ExampleRepository, GetExampleUseCase],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExampleMiddleware).forRoutes({
      path: 'example',
      method: RequestMethod.GET,
    });
  }
}
