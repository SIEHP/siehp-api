import { UseCaseInterface } from "src/shared/domain/protocols/UseCase.protocol";
import { UserRepository } from "../db/repositories/User.repository";
import { HttpStatus, Injectable } from "@nestjs/common";
import { ResetPasswordBodyDTO, ResetPasswordResponseSchema, ResetPasswordResponseDTO } from "../../domain/dtos/requests/ResetPassword.request.dto";
import { TokenProvider } from "../providers/Token.provider";
import { NotFoundUserException } from "../../domain/errors/NotFoundUser.exception";
import * as bcrypt from 'bcrypt';
import { SALT } from '../utils/constants';

@Injectable()
export class ResetPasswordUseCase implements UseCaseInterface {
  constructor(
    private userRepository: UserRepository,
    private tokenProvider: TokenProvider,
  ) {}

  async execute(resetPasswordDto: ResetPasswordBodyDTO): Promise<ResetPasswordResponseDTO> {
    const tokenData = await this.tokenProvider.getTokenData(resetPasswordDto.token);

    if (!tokenData || tokenData.expires_at < new Date()) {
        return {
          message: 'Token inválido ou expirado.',
          statusCode: HttpStatus.BAD_REQUEST
        };
      } 

      if(tokenData.is_used){
        return {
          message: 'Esse token já foi utilizado.',
          statusCode: HttpStatus.BAD_REQUEST
        };
      }

      try {
        const user = tokenData.user;
        
        if (!user) {
         throw new NotFoundUserException();
        }

        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(resetPasswordDto.password, salt);

        await this.userRepository.update({
          id: user.id,
          data: {
            password: hashedPassword
          }
        });
        
        await this.tokenProvider.invalidateToken(resetPasswordDto.token);

        return {
          message: 'Senha atualizada com sucesso.',
          statusCode: HttpStatus.OK
        };
      } catch (error) {
        return {
          message: 'Erro ao atualizar senha.',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR
        };
      }
  }
}
