import 'dotenv/config';

import z, { ZodError } from 'zod';
import { WrongEnviromentException } from '../domain/errors/WrongEnviroment.exception';

const appConfigSchema = z.object({
  PORT: z.number().default(8080).optional(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .optional(),
});

let appConfig: z.infer<typeof appConfigSchema> = {};

try {
  appConfig = appConfigSchema.parse({
    PORT: Number(process.env.APP_PORT),
    NODE_ENV: process.env.NODE_ENV,
  });
} catch (error) {
  if (error instanceof ZodError) {
    throw new WrongEnviromentException(error);
  }
}

export { appConfig };
