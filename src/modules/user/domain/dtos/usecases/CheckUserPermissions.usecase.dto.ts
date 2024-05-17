import { Permissions } from '@prisma/client';

export interface CheckUserPermissionsUseCaseDTO {
  user_id: number;
  neededPermissions: Permissions[];
}

export interface CheckUserPermissionsUseCaseResponseDTO {
  hasPermission: boolean;
  notIncludedPermissions?: Permissions[];
}
