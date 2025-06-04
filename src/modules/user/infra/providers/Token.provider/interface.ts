import { SendTokenDTO } from 'src/modules/user/infra/services/Token.service/dto';

export interface TokenProviderInterface {
  generateToken(): string;
  validateToken(storedToken: string, providedToken: string): Promise<boolean>;
  sendToken(data: SendTokenDTO): Promise<void>;
}
