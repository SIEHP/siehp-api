import {
  FindPermissionsByUserEmailDTO,
  FindPermissionsByUserEmailResponseDTO,
} from 'src/modules/user/infra/db/repositories/Permission.repository/dto';
import {
  FindUserByEmailDTO,
  FindUserByEmailResponseDTO,
} from 'src/modules/user/infra/db/repositories/User.repository/dto';

export interface UserRepositoryInterface {
  findByEmail(data: FindUserByEmailDTO): Promise<FindUserByEmailResponseDTO>;
  findPermissionsByUserEmail(
    data: FindPermissionsByUserEmailDTO,
  ): Promise<FindPermissionsByUserEmailResponseDTO>;
}
