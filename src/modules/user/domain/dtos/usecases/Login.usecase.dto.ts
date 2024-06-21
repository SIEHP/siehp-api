import { LoginBodyDTO } from '../requests/Login.request.dto';

export interface LoginUseCaseDTO extends LoginBodyDTO {}

export interface LoginUseCaseResponseDTO {
  user_id: number;
  access_token: string;
}
