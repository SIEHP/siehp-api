import { FindTokenDTO } from './dto';

export interface TokenRepositoryInterface {
  findToken(data: FindTokenDTO): Promise<any>;
}
