import { Injectable } from '@nestjs/common';
import {
  FindPermissionsByUserIdDTO,
  FindPermissionsByUserIdResponseDTO,
} from 'src/modules/user/domain/dtos/repositories/Permission.repository.dto';
import { NotFoundUserException } from 'src/modules/user/domain/errors/NotFoundUser.exception';
import { PermissionRepositoryInterface } from 'src/modules/user/domain/repositories/Permission.repository';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';

@Injectable()
export class PermissionRepository implements PermissionRepositoryInterface {
  constructor(private readonly prisma: PrismaProvider) {}

  async findPermissionsByUserId({
    user_id,
  }: FindPermissionsByUserIdDTO): Promise<FindPermissionsByUserIdResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) throw new NotFoundUserException();

    const userPermissions = await this.prisma.userPermission.findMany({
      where: {
        user_id,
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
}
