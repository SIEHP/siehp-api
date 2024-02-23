import { Injectable } from '@nestjs/common';
import {
  GetExampleParamsDTO,
  GetExampleResponseDTO,
} from 'src/shared/domain/dtos/repositories/GetExample.repository.dto';
import { ExampleRepositoryInterface } from 'src/shared/domain/repositories/Example.repository';
import { prisma } from '../prisma';

@Injectable()
export class ExampleRepository implements ExampleRepositoryInterface {
  async getExample({
    example,
  }: GetExampleParamsDTO): Promise<GetExampleResponseDTO> {
    console.log(example);
    const exampleModel = await prisma.example.findFirst();

    return {
      example: exampleModel,
    };
  }
}
