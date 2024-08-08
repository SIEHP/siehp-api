import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const TestAuthResponseSchema = z.object({
  user: z.object({
    email: z.string(),
  }),
});

export class TestAuthResponseDTO extends createZodDto(TestAuthResponseSchema) {}
