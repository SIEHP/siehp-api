import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const ForgotPasswordBodySchema = z.object({
  email: z.string().email(),
});

export class ForgotPasswordBodyDTO extends createZodDto(ForgotPasswordBodySchema) {}

export const ForgotPasswordResponseSchema = z.object({
  message: z.string(),
});

export class ForgotPasswordResponseDTO extends createZodDto(ForgotPasswordResponseSchema) {}