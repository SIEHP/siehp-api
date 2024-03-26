import { Injectable } from '@nestjs/common';
import {
  GetExampleParamsDTO,
  GetExampleResponseDTO,
} from 'src/shared/domain/dtos/repositories/Example.repository.dto';
import { ExampleRepositoryInterface } from 'src/shared/domain/repositories/Example.repository';
import { PrismaProvider } from '../../providers/Prisma.provider';

@Injectable()
export class ExampleRepository implements ExampleRepositoryInterface {
  constructor(private prisma: PrismaProvider) {}

  async getExample({
    id,
  }: GetExampleParamsDTO): Promise<GetExampleResponseDTO> {
    // const exampleModel = await this.prisma.example.findUnique({
    //   where: {
    //     id,
    //   },
    // });
    console.log(id);

    return {};
  }
}
