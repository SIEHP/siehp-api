import { createZodDto } from 'nestjs-zod';
import { password, z } from 'nestjs-zod/z';
import { passwordSchema } from './Login.request.dto';


export const tokenSchema = z.object({token: z.string().uuid('Token inválido.'), password: passwordSchema, confirmPassword: passwordSchema})


export class ValidateTokenBodyDTO extends createZodDto(tokenSchema) {}