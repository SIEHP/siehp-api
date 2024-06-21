import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const LoginBodySchema = z
  .object({
    email: z.string().email('Email inválido.').min(1).max(100),
    password: z
    .password()
    .min(8, 'Sua senha precisa de no mínimo 8 caracteres.')
    .max(100)
    .atLeastOne('digit', 'Sua senha precisa de no mínimo 1 número.')
    .atLeastOne('lowercase', 'Sua senha precisa de no mínimo 1 caractere minúsculo.')
    .atLeastOne('uppercase', 'Sua senha precisa de no mínimo 1 caractere maiúsculo.')
    .atLeastOne('special', 'Sua senha precisa de no mínimo 1 caractere especial.')
  })
  .required();

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}
