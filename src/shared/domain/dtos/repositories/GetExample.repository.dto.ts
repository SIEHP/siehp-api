// import { ExampleModel } from 'prisma';
import { Example } from '@prisma/client';

export interface GetExampleParamsDTO {
  example: string;
}

export interface GetExampleResponseDTO {
  example: Example;
}
