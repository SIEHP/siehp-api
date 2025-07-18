import { Injectable } from '@nestjs/common';
import {
  FindPermissionsByUserEmailDTO,
  FindPermissionsByUserEmailResponseDTO,
} from 'src/modules/user/infra/db/repositories/Permission.repository/dto';
import {
  FindUserByEmailDTO,
  FindUserByEmailResponseDTO,
  UpdateUserDTO,
  UpdateUserResponseDTO,
  createUserDTO,
  CreateTempUserResponseDTO,
} from 'src/modules/user/infra/db/repositories/User.repository/dto';
import { EmailAlreadyInUseExpection } from 'src/modules/user/infra/exceptions/EmailAlreadyInUse.exception';
import { NotFoundUserException } from 'src/modules/user/infra/exceptions/NotFoundUser.exception';
import { UserRepositoryInterface } from 'src/modules/user/infra/db/repositories/User.repository/interface';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaProvider) {}

  async findPermissionsByUserEmail({
    user_email,
  }: FindPermissionsByUserEmailDTO): Promise<FindPermissionsByUserEmailResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: user_email,
      },
    });

    if (!user) throw new NotFoundUserException();

    const userPermissions = await this.prisma.userPermission.findMany({
      where: {
        user_id: user.id,
      },
      select: {
        permission: {
          include: {
            permissions_included: {
              include: {
                included_permission: true,
              },
            },
          },
        },
      },
    });

    return {
      permissions: userPermissions.map(
        (userPermission) => userPermission.permission,
      ),
    };
  }

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

  async create({
    email,
    role,
    status,
    name,
    registration_code,
  }: createUserDTO): Promise<CreateTempUserResponseDTO> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new EmailAlreadyInUseExpection();
    }

    return await this.prisma.user.create({
      data: {
        email,
        role,
        status,
        name,
        registration_code,
        password: '',
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
  }

  async update({ id, data }: UpdateUserDTO): Promise<UpdateUserResponseDTO> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
