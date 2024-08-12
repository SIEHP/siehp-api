import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from '../http/controllers/User.controller';
import { LoginUseCase } from '../usecases/Login.usecase';
import { UserRepository } from '../db/repositories/User.repository';
import { UserService } from '../services/User.service';

@Module({
  controllers: [UserController],
  providers: [LoginUseCase, UserRepository, UserService],
  imports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes();
  }
}
