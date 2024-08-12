import { Permissions } from '@prisma/client';

export interface CheckUserPermissionsRequestDTO {
  user_email: string;
  neededPermissions: Permissions[];
}

export interface CheckUserPermissionsResponseDTO {
  hasPermission: boolean;
  notIncludedPermissions?: Permissions[];
}

export interface ComparePasswordRequestDTO {
  password: string;
  hash: string;
}
