import 'dotenv/config';

import z, { ZodError } from 'zod';
import { WrongEnviromentException } from '../domain/errors/WrongEnviroment.exception';

export enum Enviroment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

const appConfigSchema = z.object({
  PORT: z.number().default(8080).optional(),
  NODE_ENV: z.nativeEnum(Enviroment).default(Enviroment.DEVELOPMENT).optional(),
  DATABASE_URL: z.string().min(1),
  SHADOW_DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
});

let appConfig: z.infer<typeof appConfigSchema> = {};

try {
  appConfig = appConfigSchema.parse({
    PORT: Number(process.env.APP_PORT),
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  });
} catch (error) {
  if (error instanceof ZodError) {
    throw new WrongEnviromentException(error);
  }
}

export { appConfig };
