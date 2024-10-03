import { z, ZodError } from 'zod';
import { WrongEnviromentException } from '../domain/errors/WrongEnviroment.exception';

const defaultFromAddress = 'nao-responda@siehp.com';
const defaultFromName = 'SIEHP';

const emailConfigSchema = z.object({
  transport: z
    .object({
      host: z.string().min(1),
      port: z.number(),
      auth: z.object({
        user: z.string().min(1),
        pass: z.string().min(1),
      }),
    })
    .nullable(),
  defaults: z.object({
    from: z.object({
      address: z.string().min(1).default(defaultFromAddress).optional(),
      name: z.string().min(1).default(defaultFromName).optional(),
    }),
  }),
});

let emailConfig: z.infer<typeof emailConfigSchema> = {};

try {
  emailConfig = emailConfigSchema.parse({
    transport: process.env.EMAIL_TRANSPORT_HOST
      ? {
          host: process.env.EMAIL_TRANSPORT_HOST,
          port: Number(process.env.EMAIL_TRANSPORT_PORT),
          auth: {
            user: process.env.EMAIL_TRANSPORT_AUTH_USER,
            pass: process.env.EMAIL_TRANSPORT_AUTH_PASS,
          },
        }
      : null,
    defaults: {
      from: {
        address: process.env.EMAIL_FROM_ADDRESS || defaultFromAddress,
        name: process.env.EMAIL_FROM_NAME || defaultFromName,
      },
    },
  });
} catch (error) {
  if (error instanceof ZodError) {
    throw new WrongEnviromentException(error);
  }
}

export { emailConfig };
