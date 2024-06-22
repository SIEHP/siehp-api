import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const EmailBodySchema = z
  .object({
    email: z.string().email('Email inválido.').min(1).max(100),
  })
  .required();

export class EmailBodyDTO extends createZodDto(EmailBodySchema) {}

export { EmailBodySchema };
