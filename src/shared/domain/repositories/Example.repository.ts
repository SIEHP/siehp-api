import {
  GetExampleParamsDTO,
  GetExampleResponseDTO,
} from '../dtos/repositories/Example.repository.dto';

export interface ExampleRepositoryInterface {
  getExample(data: GetExampleParamsDTO): Promise<GetExampleResponseDTO>;
}
