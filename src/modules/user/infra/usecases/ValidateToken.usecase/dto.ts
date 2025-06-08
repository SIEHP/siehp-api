import {
  ValidateTokenBodyDTO,
  ValidateTokenResponseDTO,
} from 'src/modules/user/infra/requests/ValidateToken.request/dto';

export interface ValidateTokenUseCaseDTO extends ValidateTokenBodyDTO {}

export interface ValidateTokenUseCaseResponseDTO
  extends ValidateTokenResponseDTO {}
