import { Permission, Prisma, Role, Status, User, UserPermission, Permissions } from '@prisma/client';

export interface FindUserByEmailDTO {
  email: string;
}

export interface FindUserByEmailResponseDTO
  extends Omit<
    User,
    'updated_at' | 'created_at' | 'created_by' | 'updated_by'
  > {
    user_permissions: {
      permission: Pick<Permission, 'name' | 'description'> & {
        permissions_included: {
          included_permission: Pick<Permission, 'name' | 'description'>;
        }[];
      };
    }[];
  }

export interface UpdateUserDTO {
  id: number;
  data: Prisma.UserUpdateInput;
}

export interface UpdateUserResponseDTO extends Omit<User, 'updated_at' | 'created_at' | 'created_by' | 'updated_by'> {}

export interface createUserDTO {
  email: string;
  role: Role;
  status: Status;
  name: string;
  registration_code: string;
}

export interface CreateTempUserResponseDTO extends Omit<User, 'updated_at' | 'created_at' | 'created_by' | 'updated_by' | 'profile_image_url'> {}

export interface CreateUserPermissionDTO {
  user_id: number;
  permissions: Permissions[];

}

export interface CreateUserPermissionResponseDTO extends Array<UserPermission> {}

export interface FindAllProfessorsDTO {
  id: number;
  name: string;
  email: string;
  registration_code: string;
  role: Role;
  status: Status;
}

export type FindAllProfessorsResponseDTO = FindAllProfessorsDTO[];
