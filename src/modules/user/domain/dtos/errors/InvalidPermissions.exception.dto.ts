import { Permissions } from '@prisma/client';

export interface InvalidPermissionsExceptionDTO {
  permissions: Permissions[];
}
