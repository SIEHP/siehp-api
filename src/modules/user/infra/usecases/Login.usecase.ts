import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import {
  LoginUseCaseDTO,
  LoginUseCaseResponseDTO,
} from '../../domain/dtos/usecases/Login.usecase.dto';
import { UserRepository } from '../db/repositories/User.repository';
import { NotFoundUserException } from '../../domain/errors/NotFoundUser.exception';
import { InvalidPasswordException } from '../../domain/errors/InvalidPassword.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUseCase implements UseCaseInterface {
  constructor(
    private userRepository: UserRepository,
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

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw new InvalidPasswordException();
    }

    const payload = { email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user_id: user.id,
      access_token: accessToken,
    };
  }
}
