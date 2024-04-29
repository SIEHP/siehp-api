import {
  FindPermissionsByUserIdDTO,
  FindPermissionsByUserIdResponseDTO,
} from '../dtos/repositories/Permission.repository.dto';

export interface PermissionRepositoryInterface {
  findPermissionsByUserId(
    data: FindPermissionsByUserIdDTO,
  ): Promise<FindPermissionsByUserIdResponseDTO>;
}
