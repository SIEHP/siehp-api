import {
  ActivateUserRequestDTO,
  CheckUserPermissionsRequestDTO,
  CheckUserPermissionsResponseDTO,
  ComparePasswordRequestDTO,
  CreateTempUserRequestDTO,
  CreateTempUserResponseDTO,
} from './dto';

export interface UserServiceInterface {
  checkUserPermissions(
    data: CheckUserPermissionsRequestDTO,
  ): Promise<CheckUserPermissionsResponseDTO>;
  comparePassword(data: ComparePasswordRequestDTO): Promise<boolean>;
  createTempUser(
    data: CreateTempUserRequestDTO,
  ): Promise<CreateTempUserResponseDTO>;
  activateUser(data: ActivateUserRequestDTO): Promise<void>;
}
