import { Injectable } from '@nestjs/common';
import {
  GetExampleParamsDTO,
  GetExampleResponseDTO,
} from 'src/shared/domain/dtos/repositories/GetExample.repository.dto';
import { ExampleRepositoryInterface } from 'src/shared/domain/repositories/Example.repository';
import { PrismaProvider } from '../prisma/providers/Prisma.provider';

@Injectable()
export class ExampleRepository implements ExampleRepositoryInterface {
  constructor(private prisma: PrismaProvider) {}

  async getExample({
    example,
  }: GetExampleParamsDTO): Promise<GetExampleResponseDTO> {
    console.log(example);
    const exampleModel = await this.prisma.example.findFirst();

    return {
      example: exampleModel,
    };
  }
}
