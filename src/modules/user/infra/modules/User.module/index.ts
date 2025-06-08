import { Module } from '@nestjs/common';
import { UserController } from '../../http/controllers/User.controller';
import { LoginUseCase } from '../../usecases/Login.usecase';
import { UserRepository } from '../../db/repositories/User.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { TokenProvider } from 'src/modules/user/infra/providers/Token.provider';
import { TokenRepository } from 'src/modules/user/infra/db/repositories/Token.repository';
import { InviteProfessorUseCase } from '../../usecases/InviteProfessor.usecase';
import { ValidateTokenUseCase } from '../../usecases/ValidateToken.usecase';

@Module({
  controllers: [UserController],
  providers: [
    LoginUseCase,
    InviteProfessorUseCase,
    ValidateTokenUseCase,
    UserRepository,
    UserService,
    TokenProvider,
    TokenRepository,
  ],
})
export class UserModule {}
