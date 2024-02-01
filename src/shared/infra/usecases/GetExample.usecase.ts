import {
  GetExampleUseCaseParamsDTO,
  GetExampleUseCaseResponseDTO,
} from 'src/shared/domain/dtos/usecases/GetExample.usecase.dto';
import { ExampleRepository } from '../db/repositories/Example.repository';
import { exampleFunction } from '../utils/functions';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetExampleUseCase {
  constructor(private exampleRepository: ExampleRepository) {}

  async execute({}: GetExampleUseCaseParamsDTO): Promise<GetExampleUseCaseResponseDTO> {
    const example = await this.exampleRepository.getExample({
      example: exampleFunction('example-constant') ? 'example' : 'not example',
    });

    const response: GetExampleUseCaseResponseDTO = {
      example: example.example,
    };

    return response;
  }
}
