import { Injectable } from '@nestjs/common';
import {
  FindPermissionsByUserEmailDTO,
  FindPermissionsByUserEmailResponseDTO,

} from 'src/modules/user/domain/dtos/repositories/Permission.repository.dto';
import {
  FindUserByEmailDTO,
  FindUserByEmailResponseDTO,
  UpdateUserDTO,
  UpdateUserResponseDTO,
  createUserDTO,
  CreateTempUserResponseDTO,
  CreateUserPermissionDTO,
  CreateUserPermissionResponseDTO,
  FindAllProfessorsResponseDTO,
  FindUserByIdDTO,
  FindUserByIdResponseDTO,
} from 'src/modules/user/domain/dtos/repositories/User.repository.dto';
import { EmailAlreadyInUseExpection } from 'src/modules/user/domain/errors/EmailAlreadyInUse.expection';
import { NotFoundUserException } from 'src/modules/user/domain/errors/NotFoundUser.exception';
import { UserRepositoryInterface } from 'src/modules/user/domain/repositories/User.repository';
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
        profile_image_url: true,
        user_permissions: {
          select: {
            permission: {
              select: {
                name: true,
                description: true,
                permissions_included: {
                  select: {
                    included_permission: {
                      select: {
                        name: true,
                        description: true,
                      },
                    },
                  },
                }
              },
            },
          },
        },
      },
    });

    return user;
  }

  async findById({
    id,
  }: FindUserByIdDTO): Promise<FindUserByIdResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        registration_code: true,
        role: true,
        status: true,
        profile_image_url: true,
      },
    });

    if (!user) throw new NotFoundUserException();

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

  async update({
    id,
   data
  }: UpdateUserDTO): Promise<UpdateUserResponseDTO> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async createUserPermission({
    user_id,
    permissions,
  }: CreateUserPermissionDTO): Promise<void> {

    const permissionsIds = await this.prisma.permission.findMany({
      where: {
        name: {
          in: permissions,
        },
      },
    });
    
    await this.prisma.userPermission.createMany({
      data: permissionsIds.map((permission) => ({
        user_id,
        permission_id: permission.id,
      })),
    });

    return;
  }

  async findAllProfessors(): Promise<FindAllProfessorsResponseDTO> {
    return await this.prisma.user.findMany({
      where: {
        role: 'PROFESSOR',
      },
      select: {
        id: true,
        name: true,
        email: true,
        registration_code: true,
        role: true,
        status: true,
      },
    });
  }
}
