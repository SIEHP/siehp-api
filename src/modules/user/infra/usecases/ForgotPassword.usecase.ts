import { Injectable } from "@nestjs/common";
import { UserRepository } from "../db/repositories/User.repository";
import { UseCaseInterface } from "src/shared/domain/protocols/UseCase.protocol";
import { ForgotPasswordResponseDTO } from "../../domain/dtos/requests/ForgotPassword.request.dto";
import { NotFoundUserException } from "../../domain/errors/NotFoundUser.exception";
import { ForgotPasswordBodyDTO } from "../../domain/dtos/requests/ForgotPassword.request.dto";
import { TokenProvider } from "../providers/Token.provider";


@Injectable()
export class ForgotPasswordUseCase implements UseCaseInterface {
  constructor(
    private userRepository: UserRepository,
    private tokenProvider: TokenProvider,
  ) {}
  
  async execute(forgotPasswordDto: ForgotPasswordBodyDTO): Promise<ForgotPasswordResponseDTO> {
    const user = await this.userRepository.findByEmail({ email: forgotPasswordDto.email });

    if (!user) {
      throw new NotFoundUserException();
    }

    await this.tokenProvider.sendForgotPasswordToken({
        email: user.email,
        userId: user.id,
    });

    return {
      message: 'E-mail de recuperação de senha enviado com sucesso',
    };
  }
}