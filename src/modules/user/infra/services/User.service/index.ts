import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import {
  ActivateUserRequestDTO,
  CheckUserPermissionsRequestDTO,
  CheckUserPermissionsResponseDTO,
  ComparePasswordRequestDTO,
  CreateTempUserRequestDTO,
  CreateTempUserResponseDTO,
} from 'src/modules/user/infra/services/User.service/dto';
import { Permissions, Status } from '@prisma/client';
import { UserServiceInterface } from 'src/modules/user/infra/services/User.service/interface';
import { UserRepository } from 'src/modules/user/infra/db/repositories/User.repository';
import { SALT } from 'src/modules/user/infra/utils/constants';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(private userRepository: UserRepository) {}

  async comparePassword(data: ComparePasswordRequestDTO): Promise<boolean> {
    return await bcrypt.compare(data.password, data.hash);
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

  async createTempUser(
    data: CreateTempUserRequestDTO,
  ): Promise<CreateTempUserResponseDTO> {
    const user = await this.userRepository.create({
      email: data.email,
      role: data.role,
      status: 'INACTIVE',
      name: data.email.split('@')[0], // Nome temporário baseado no email
      registration_code: Math.random().toString(36).substring(7), // Código de registro temporário
    });

    return user;
  }

  async activateUser(data: ActivateUserRequestDTO): Promise<void> {
    const salt = await bcrypt.genSalt(SALT);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    await this.userRepository.update({
      id: data.userId,
      data: {
        password: hashedPassword,
        status: 'ACTIVE' as Status,
      },
    });
  }
}
