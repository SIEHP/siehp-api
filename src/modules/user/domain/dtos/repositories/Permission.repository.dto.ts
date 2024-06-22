import { IncludedPermissions, Permission } from '@prisma/client';

export interface FindPermissionsByUserEmailDTO {
  user_email: string;
}

export interface FindPermissionsByUserEmailResponseDTO {
  permissions: (Permission & {
    permissions_included: (IncludedPermissions & {
      included_permission: Permission;
    })[];
  })[];
}
