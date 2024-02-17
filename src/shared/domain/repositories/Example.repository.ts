import {
  GetExampleParamsDTO,
  GetExampleResponseDTO,
} from '../dtos/repositories/GetExample.repository.dto';

export interface ExampleRepositoryInterface {
  getExample(data: GetExampleParamsDTO): Promise<GetExampleResponseDTO>;
}
