import {
  GetExampleUseCaseParamsDTO,
  GetExampleUseCaseResponseDTO,
} from 'src/shared/domain/dtos/usecases/GetExample.usecase.dto';
import { ExampleRepository } from '../../db/repositories/Example.repository';
import { exampleFunction } from '../../utils/functions';
import { Injectable } from '@nestjs/common';
import { ExampleException } from 'src/shared/domain/errors/Example.exception';
import { ExampleEnum } from 'src/shared/domain/dtos/requests/GetExample.request.dto';

@Injectable()
export class GetExampleUseCase {
  constructor(private exampleRepository: ExampleRepository) {}

  async execute({
    age,
    name,
    sex,
  }: GetExampleUseCaseParamsDTO): Promise<GetExampleUseCaseResponseDTO> {
    console.log('age', age);
    console.log('name', name);
    console.log('sex', sex);

    if (sex === ExampleEnum.FEMALE) {
      throw new ExampleException();
    }

    const example = await this.exampleRepository.getExample({
      example: exampleFunction('example-constant') ? 'example' : 'not example',
    });

    const response: GetExampleUseCaseResponseDTO = {
      example: example.example,
    };

    return response;
  }
}
