import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import {
  CheckUserPermissionsRequestDTO,
  CheckUserPermissionsResponseDTO,
} from '../../domain/dtos/services/User.service.dto';
import { Permissions } from '@prisma/client';
import { UserServiceInterface } from '../../domain/services/User.service';
import { UserRepository } from '../db/repositories/User.repository';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(private userRepository: UserRepository) {}

  async comparePassword({ password, hash }) {
    return await bcrypt.compare(password, hash);
  }

  async checkUserPermissions({
    user_email,
    neededPermissions,
  }: CheckUserPermissionsRequestDTO): Promise<CheckUserPermissionsResponseDTO> {
    const userPermissions = (
      await this.userRepository.findPermissionsByUserEmail({
        user_email,
      })
    ).permissions;

    const permissionsSet: Set<Permissions> = new Set([
      ...userPermissions.map((userPermission) => userPermission.name),
      ...userPermissions.flatMap((userPermission) =>
        userPermission.permissions_included.map(
          (permission) => permission.included_permission.name,
        ),
      ),
    ]);

    const notIncludedPermissions = neededPermissions.filter(
      (neededPermission) => {
        return !permissionsSet.has(neededPermission);
      },
    );

    const userHasPermission = notIncludedPermissions.length === 0;

    return {
      hasPermission: userHasPermission,
      notIncludedPermissions,
    };
  }
}
