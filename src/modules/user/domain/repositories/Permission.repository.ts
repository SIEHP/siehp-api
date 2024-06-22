import {
  FindPermissionsByUserEmailDTO,
  FindPermissionsByUserEmailResponseDTO,
} from '../dtos/repositories/Permission.repository.dto';

export interface PermissionRepositoryInterface {
  findPermissionsByUserEmail(
    data: FindPermissionsByUserEmailDTO,
  ): Promise<FindPermissionsByUserEmailResponseDTO>;
}
