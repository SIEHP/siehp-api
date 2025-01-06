import { FindTokenDTO } from "../dtos/repositories/Token.repository.dto"

export interface TokenRepositoryInterface {
    findToken(data: FindTokenDTO): Promise<any>;
}