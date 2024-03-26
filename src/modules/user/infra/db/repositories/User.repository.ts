import { Injectable } from '@nestjs/common';
import {
  FindUserByEmailDTO,
  FindUserByEmailResponseDTO,
} from 'src/modules/user/domain/dtos/repositories/User.repository.dto';
import { UserRepositoryInterface } from 'src/modules/user/domain/repositories/User.repository';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaProvider) {}

  async findByEmail({
    email,
  }: FindUserByEmailDTO): Promise<FindUserByEmailResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        registration_code: true,
        role: true,
        status: true,
      },
    });

    return user;
  }
}
