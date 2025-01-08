import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

  export const invitedEmailSchema = z
  .string({
    description: 'Email',
  })
  .email('Email inválido.')
  .min(1, ' ')
  .max(100, ' ')
  .default('professor@example.com');


  export const inviteBodySchema = z
  .object({
    email: invitedEmailSchema,
  })
  .required();


export class InviteBodyDTO extends createZodDto(inviteBodySchema) {}

const inviteResponseSchema = z.object({
  message: z.string(),
});

export class InviteResponseDTO extends createZodDto(inviteResponseSchema) {}