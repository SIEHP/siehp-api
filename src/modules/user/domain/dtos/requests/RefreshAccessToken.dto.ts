import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const RefreshAccessTokenSchema = z.object({
  email: z.string(),
});

export class RefreshAccessTokenDto extends createZodDto(RefreshAccessTokenSchema) {}

const RefreshAccessTokenResponseSchema = z.object({
    token: z.string(),
    user: z.object({
      id: z.number(),
      name: z.string(),
      role: z.string(),
      profile_image_url: z.string().optional(),
      permissions: z.array(z.string()),
    }),
  });

export class RefreshAccessTokenResponseDto extends createZodDto(RefreshAccessTokenResponseSchema) {}