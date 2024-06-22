import { LoginBodyDTO } from '../requests/Login.request.dto';

export interface LoginUseCaseDTO extends LoginBodyDTO {}

export interface LoginUseCaseResponseDTO {
  access_token: string;
}
