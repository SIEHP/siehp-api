import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from '../http/controllers/User.controller';
import { LoginUseCase } from '../usecases/Login.usecase';
import { UserRepository } from '../db/repositories/User.repository';

@Module({
  controllers: [UserController],
  providers: [LoginUseCase, UserRepository],
  imports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes();
  }
}
