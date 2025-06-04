export interface SendTokenDTO {
    email: string;
    userId: number;
}

export interface ValidateTokenDTO {
    token: string;
}

export interface TokenValidationResponseDTO {
    isValid: boolean;
    email?: string;
    message: string;
}
  