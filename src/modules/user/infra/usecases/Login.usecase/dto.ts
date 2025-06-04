import {
  LoginBodyDTO,
  LoginResponseDTO,
} from 'src/modules/user/infra/requests/Login.request/dto';

export interface LoginUseCaseDTO extends LoginBodyDTO {}

export interface LoginUseCaseResponseDTO extends LoginResponseDTO {}
