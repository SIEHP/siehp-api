import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/infra/usecases/protocol';
import {
  LoginUseCaseDTO,
  LoginUseCaseResponseDTO,
} from 'src/modules/user/infra/usecases/Login.usecase/dto';
import { UserRepository } from '../../db/repositories/User.repository';
import { NotFoundUserException } from 'src/modules/user/infra/exceptions/NotFoundUser.exception';
import { InvalidPasswordException } from 'src/modules/user/infra/exceptions/InvalidPassword.exception';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../services/User.service';

@Injectable()
export class LoginUseCase implements UseCaseInterface {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async execute({
    email,
    password,
  }: LoginUseCaseDTO): Promise<LoginUseCaseResponseDTO> {
    const user = await this.userRepository.findByEmail({ email });

    if (!user) {
      throw new NotFoundUserException();
    }

    const checkPassword = await this.userService.comparePassword({
      password,
      hash: user.password,
    });

    if (!checkPassword) {
      throw new InvalidPasswordException();
    }

    const payload = { email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
    };
  }
}
