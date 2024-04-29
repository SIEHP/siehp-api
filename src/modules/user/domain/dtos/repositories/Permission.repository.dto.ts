import { IncludedPermissions, Permission } from '@prisma/client';

export interface FindPermissionsByUserIdDTO {
  user_id: number;
}

export interface FindPermissionsByUserIdResponseDTO {
  permissions: (Permission & {
    permissions_included: (IncludedPermissions & {
      included_permission: Permission;
    })[];
  })[];
}
