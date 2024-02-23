import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export enum ExampleEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

const CreateExampleBodySchema = z
  .object({
    name: z.string().describe('Nome do exemplo'),
    age: z.number().describe('Idade do exemplo'),
    sex: z.nativeEnum(ExampleEnum).describe('We respect your gender choice'),
  })
  .required();

export class CreateExampleBodyDTO extends createZodDto(
  CreateExampleBodySchema,
) {}
