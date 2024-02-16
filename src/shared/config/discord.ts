import 'dotenv/config';

import z, { ZodError } from 'zod';
import { WrongEnviromentException } from '../domain/errors/WrongEnviroment.exception';

const discordConfigSchema = z.object({
  ERROR_WEBHOOK_URL: z.string().url().optional(),
  LOG_WEBHOOK_URL: z.string().url().optional(),
});

let discordConfig: z.infer<typeof discordConfigSchema> = {};

try {
  discordConfig = discordConfigSchema.parse({
    ERROR_WEBHOOK_URL: process.env.DISCORD_ERROR_WEBHOOK_URL,
    LOG_WEBHOOK_URL: process.env.DISCORD_LOG_WEBHOOK_URL,
  });
} catch (error) {
  if (error instanceof ZodError) {
    throw new WrongEnviromentException(error);
  }
}

export { discordConfig };
