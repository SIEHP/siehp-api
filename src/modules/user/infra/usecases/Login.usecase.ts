import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import { LoginUseCaseDTO } from '../../domain/dtos/usecases/Login.usecase.dto';
import { UserRepository } from '../db/repositories/User.repository';
import { Permissions } from '@prisma/client';

@Injectable()
export class LoginUseCase implements UseCaseInterface {
  constructor(private UserRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: LoginUseCaseDTO): Promise<LoginUseCaseDTO> {
    const user = await this.UserRepository.findByEmail({ email });

    if (!user) {
    }
    return {
      user,
    };
  }
}
