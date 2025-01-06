import { SendTokenDTO } from "../dtos/services/Token.Service.dto";

export interface TokenProviderInterface {
    generateToken(): string;
    validateToken(storedToken: string, providedToken: string): Promise<boolean>;
    sendToken(data: SendTokenDTO): Promise<void>;
}
  
