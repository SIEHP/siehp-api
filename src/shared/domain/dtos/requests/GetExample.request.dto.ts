import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateExampleSchema = z
  .object({
    name: z.string().describe('Nome do exemplo'),
    age: z.number().describe('Idade do exemplo'),
    sex: z
      .enum(['male', 'female', 'nonbinary'])
      .describe('We respect your gender choice'),
  })
  .required();

export class CreateExampleDTO extends createZodDto(CreateExampleSchema) {}
