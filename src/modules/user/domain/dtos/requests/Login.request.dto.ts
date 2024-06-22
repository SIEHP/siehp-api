import { createZodDto } from 'nestjs-zod';
import { EmailBodySchema } from './email.request.dto';

const LoginBodySchema = EmailBodySchema;

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}
