import {
  FindPermissionsByUserEmailDTO,
  FindPermissionsByUserEmailResponseDTO,
} from '../dtos/repositories/Permission.repository.dto';
import {
  FindUserByEmailDTO,
  FindUserByEmailResponseDTO,
  FindUserByIdDTO,
  FindUserByIdResponseDTO,
} from '../dtos/repositories/User.repository.dto';

export interface UserRepositoryInterface {
  findByEmail(data: FindUserByEmailDTO): Promise<FindUserByEmailResponseDTO>;
  findById(data: FindUserByIdDTO): Promise<FindUserByIdResponseDTO>;
  findPermissionsByUserEmail(
    data: FindPermissionsByUserEmailDTO,
  ): Promise<FindPermissionsByUserEmailResponseDTO>;
}
