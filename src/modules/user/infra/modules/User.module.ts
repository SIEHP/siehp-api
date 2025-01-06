import { Module } from '@nestjs/common';
import { UserController } from '../http/controllers/User.controller';
import { LoginUseCase } from '../usecases/Login.usecase';
import { UserRepository } from '../db/repositories/User.repository';
import { UserService } from '../services/User.service';
import { TokenProvider } from '../providers/Token.provider';
import { TokenRepository } from '../db/repositories/Token.repository';

@Module({
  controllers: [UserController],
  providers: [
    LoginUseCase, 
    UserRepository, 
    UserService,
    TokenProvider,
    TokenRepository
  ],
})
export class UserModule {}
