import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/infra/usecases/protocol';
import { ValidateTokenUseCaseDTO } from './dto';
import { ValidateTokenUseCaseResponseDTO } from './dto';
import { TokenProvider } from '../../providers/Token.provider';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { join } from 'path';
import { EmailProvider } from 'src/shared/infra/providers/Email.provider';
import { InvalidTokenException } from '../../exceptions/InvalidToken.exception';
import { AlreadyUsedTokenException } from '../../exceptions/AlreadyUsedToken.exception';

@Injectable()
export class ValidateTokenUseCase implements UseCaseInterface {
  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly userService: UserService,
    private readonly emailProvider: EmailProvider,
  ) {}

  async execute({
    password,
    token,
  }: ValidateTokenUseCaseDTO): Promise<ValidateTokenUseCaseResponseDTO> {
    const tokenData = await this.tokenProvider.getTokenData(token);

    if (!tokenData || tokenData.expires_at < new Date()) {
      throw new InvalidTokenException();
    }

    if (tokenData.is_used) {
      throw new AlreadyUsedTokenException();
    }

    await this.userService.activateUser({
      userId: tokenData.user_id,
      password,
    });

    await this.tokenProvider.invalidateToken(token);

    const templatePath = join(
      process.cwd(),
      'src/modules/user/infra/views/emails/success.hbs',
    );

    await this.emailProvider.send({
      subject: 'Cadastro Realizado com Sucesso - SIEHP',
      to: tokenData.user.email,
      templateData: {
        filePath: templatePath,
        variables: {
          userName: tokenData.user.email,
          frontendUrl: process.env.FRONTEND_URL,
        },
      },
    });

    return {
      message: 'Conta criada com sucesso',
    };
  }
}
