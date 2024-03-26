import {
  FindUserByEmailDTO,
  FindUserByEmailResponseDTO,
} from '../dtos/repositories/User.repository.dto';

export interface UserRepositoryInterface {
  findByEmail(data: FindUserByEmailDTO): Promise<FindUserByEmailResponseDTO>;
}
