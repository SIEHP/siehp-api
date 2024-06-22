import { Injectable } from '@nestjs/common';
import {
  FindPermissionsByUserEmailDTO,
  FindPermissionsByUserEmailResponseDTO,
} from 'src/modules/user/domain/dtos/repositories/Permission.repository.dto';
import { NotFoundUserException } from 'src/modules/user/domain/errors/NotFoundUser.exception';
import { PermissionRepositoryInterface } from 'src/modules/user/domain/repositories/Permission.repository';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';

@Injectable()
export class PermissionRepository implements PermissionRepositoryInterface {
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
}
