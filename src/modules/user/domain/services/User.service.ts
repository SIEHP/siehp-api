import {
  CheckUserPermissionsRequestDTO,
  CheckUserPermissionsResponseDTO,
  ComparePasswordRequestDTO,
} from '../dtos/services/User.service.dto';

export interface UserServiceInterface {
  checkUserPermissions(
    data: CheckUserPermissionsRequestDTO,
  ): Promise<CheckUserPermissionsResponseDTO>;
  comparePassword(data: ComparePasswordRequestDTO): Promise<boolean>;
}
