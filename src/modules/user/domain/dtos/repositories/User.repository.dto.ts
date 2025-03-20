import { Prisma, Role, Status, User } from '@prisma/client';

export interface FindUserByEmailDTO {
  email: string;
}

export interface FindUserByEmailResponseDTO
  extends Omit<
    User,
    'updated_at' | 'created_at' | 'created_by' | 'updated_by'
  > {}

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