import { z, ZodError } from 'zod';
import { WrongEnviromentException } from '../domain/errors/WrongEnviroment.exception';

const emailConfigSchema = z.object({
  from: z.string().min(1).default('teste@mandarin.com.br'),
  name: z.string().min(1).default('teste mandarin'),
});

let emailConfig: z.infer<typeof emailConfigSchema> = {};

try {
  emailConfig = emailConfigSchema.parse({
    ERROR_WEBHOOK_URL: process.env.DISCORD_ERROR_WEBHOOK_URL || null,
    LOG_WEBHOOK_URL: process.env.DISCORD_LOG_WEBHOOK_URL || null,
  });
} catch (error) {
  if (error instanceof ZodError) {
    throw new WrongEnviromentException(error);
  }
}

export { emailConfig };
