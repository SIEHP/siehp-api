import { Module } from '@nestjs/common';
import { UserController } from '../http/controllers/User.controller';
import { LoginUseCase } from '../usecases/Login.usecase';
import { UserRepository } from '../db/repositories/User.repository';
import { UserService } from '../services/User.service';
import { TokenProvider } from '../providers/Token.provider';
import { TokenRepository } from '../db/repositories/Token.repository';
import { RefreshAccessTokenUseCase } from '../usecases/Refresh.access.token.usecase';

@Module({
  controllers: [UserController],
  providers: [
    LoginUseCase, 
    UserRepository, 
    UserService,
    TokenProvider,
    TokenRepository,
    RefreshAccessTokenUseCase,
  ],
})
export class UserModule {}
