import { createZodDto } from 'nestjs-zod';
import { password, z } from 'nestjs-zod/z';
import { passwordSchema } from './Login.request.dto';

export const tokenSchema = z
  .object({
    token: z.string().uuid('Token inválido.'),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'As senhas não coincidem.',
        code: z.ZodIssueCode.custom,
      });

    }
  });

export class ValidateTokenBodyDTO extends createZodDto(tokenSchema) {}
