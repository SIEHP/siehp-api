import { User } from '@prisma/client';

export interface FindUserByEmailDTO {
  email: string;
}

export interface FindUserByEmailResponseDTO
  extends Omit<
    User,
    'updated_at' | 'created_at' | 'created_by' | 'updated_by'
  > {}
