import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from '../http/controllers/User.controller';
import { LoginUseCase } from '../usecases/Login.usecase';
import { UserRepository } from '../db/repositories/User.repository';
import { CheckUserPermissionsUseCase } from '../usecases/CheckUserPermissions.usecase';
import { PermissionRepository } from '../db/repositories/Permission.repository';

@Module({
  controllers: [UserController],
  providers: [
    LoginUseCase,
    UserRepository,
    CheckUserPermissionsUseCase,
    PermissionRepository,
  ],
  imports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes();
  }
}
