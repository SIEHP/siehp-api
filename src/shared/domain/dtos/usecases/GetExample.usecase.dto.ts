import { ExampleModel } from '../repositories/GetExample.repository.dto';

export interface GetExampleUseCaseParamsDTO {}

export interface GetExampleUseCaseResponseDTO {
  example: ExampleModel;
}
