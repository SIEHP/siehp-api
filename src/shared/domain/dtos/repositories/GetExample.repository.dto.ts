// import { ExampleModel } from 'prisma';

export interface ExampleModel {
  // Remover depois
  example: string;
}

export interface GetExampleParamsDTO {
  example: string;
}

export interface GetExampleResponseDTO {
  example: ExampleModel;
}
