import { Permissions } from '@prisma/client';

export interface CheckUserPermissionsUseCaseDTO {
  user_email: string;
  neededPermissions: Permissions[];
}

export interface CheckUserPermissionsUseCaseResponseDTO {
  hasPermission: boolean;
  notIncludedPermissions?: Permissions[];
}
