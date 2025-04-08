import { Permissions, Role } from '@prisma/client';

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

export interface CreateTempUserRequestDTO {
  email: string;
  role: Role;
}

export interface CreateTempUserResponseDTO {
  id: number;
  email: string;
}

export interface ActivateUserRequestDTO {
  userId: number;
  password: string;
  permissions: Permissions[];
}

export interface ChangeUserStatusRequestDTO {
  userId: number; 
}


