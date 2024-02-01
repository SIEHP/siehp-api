import { Injectable } from '@nestjs/common';
import {
  GetExampleParamsDTO,
  GetExampleResponseDTO,
} from 'src/shared/domain/dtos/repositories/GetExample.repository.dto';
import { ExampleRepositoryInterface } from 'src/shared/domain/repositories/Example.repository';

@Injectable()
export class ExampleRepository implements ExampleRepositoryInterface {
  async getExample({
    example,
  }: GetExampleParamsDTO): Promise<GetExampleResponseDTO> {
    // chama o banco: prisma.where({ example: example })

    return {
      example: {
        example,
      },
    };
  }
}
