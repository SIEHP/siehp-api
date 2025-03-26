import { SendTokenDTO } from "../dtos/services/Token.Service.dto";

export interface TokenProviderInterface {
    generateToken(): string;
    validateToken(storedToken: string, providedToken: string): Promise<boolean>;
    sendInviteToken(data: SendTokenDTO): Promise<void>;
    sendForgotPasswordToken(data: SendTokenDTO): Promise<void>;
}
  
