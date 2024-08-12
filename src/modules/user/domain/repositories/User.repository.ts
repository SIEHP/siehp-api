import {
  FindPermissionsByUserEmailDTO,
  FindPermissionsByUserEmailResponseDTO,
} from '../dtos/repositories/Permission.repository.dto';
import {
  FindUserByEmailDTO,
  FindUserByEmailResponseDTO,
} from '../dtos/repositories/User.repository.dto';

export interface UserRepositoryInterface {
  findByEmail(data: FindUserByEmailDTO): Promise<FindUserByEmailResponseDTO>;
  findPermissionsByUserEmail(
    data: FindPermissionsByUserEmailDTO,
  ): Promise<FindPermissionsByUserEmailResponseDTO>;
}
