import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const passwordSchema = z
  .password({
    description: 'Senha',
  })
  .min(8, 'Sua senha precisa de no mínimo 8 caracteres.')
  .max(100, 'Sua senha precisa ser no máximo 100 caracteres.')
  .atLeastOne('digit', 'Sua senha precisa de no mínimo 1 número.')
  .atLeastOne(
    'lowercase',
    'Sua senha precisa de no mínimo 1 caractere minúsculo.',
  )
  .atLeastOne(
    'uppercase',
    'Sua senha precisa de no mínimo 1 caractere maiúsculo.',
  )
  .atLeastOne(
    'special',
    'Sua senha precisa de no mínimo 1 caractere especial.',
  );

export const emailSchema = z
  .string({
    description: 'Email',
  })
  .email('Email inválido.')
  .min(1, ' ')
  .max(100, ' ')
  .default('test1@email.com');

export const LoginBodySchema = z
  .object({
    email: emailSchema,
    password: z
      .string({ description: 'Senha' })
      .min(1, 'Senha inválida.')
      .max(100, 'Senha inválida.')
      .default('Coxinh@123'),
  })
  .required();

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}

const LoginResponseSchema = z.object({
  access_token: z.string(),
});

export class LoginResponseDTO extends createZodDto(LoginResponseSchema) {}
