import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import {
  CheckUserPermissionsUseCaseDTO,
  CheckUserPermissionsUseCaseResponseDTO,
} from '../../domain/dtos/usecases/CheckUserPermissions.usecase.dto';
import { PermissionRepository } from '../db/repositories/Permission.repository';
import { Permissions } from '@prisma/client';

@Injectable()
export class CheckUserPermissionsUseCase implements UseCaseInterface {
  constructor(private permissionRepository: PermissionRepository) {}

  async execute({
    user_id,
    neededPermissions,
  }: CheckUserPermissionsUseCaseDTO): Promise<CheckUserPermissionsUseCaseResponseDTO> {
    const userPermissions = (
      await this.permissionRepository.findPermissionsByUserId({
        user_id,
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
