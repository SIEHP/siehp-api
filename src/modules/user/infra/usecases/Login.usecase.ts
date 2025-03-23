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
import { UserService } from '../services/User.service';

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
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        profile_image_url: user.profile_image_url,
      },
    };
  }
}
