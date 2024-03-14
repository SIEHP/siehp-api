import {
  GetExampleUseCaseParamsDTO,
  GetExampleUseCaseResponseDTO,
} from 'src/shared/domain/dtos/usecases/GetExample.usecase.dto';
import { ExampleRepository } from '../db/repositories/Example.repository';
import { Injectable } from '@nestjs/common';
import { ExampleException } from 'src/shared/domain/errors/Example.exception';
import { ExampleEnum } from 'src/shared/domain/dtos/requests/GetExample.request.dto';

@Injectable()
export class GetExampleUseCase {
  constructor(private exampleRepository: ExampleRepository) {}

  async execute({
    id,
    sex,
  }: GetExampleUseCaseParamsDTO): Promise<GetExampleUseCaseResponseDTO> {
    if (sex === ExampleEnum.FEMALE) {
      throw new ExampleException();
    }

    const example = await this.exampleRepository.getExample({
      id,
    });

    const response: GetExampleUseCaseResponseDTO = {
      example,
    };

    return response;
  }
}
