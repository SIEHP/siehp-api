import { z } from 'zod';

export const createExampleSchema = z
  .object({
    name: z.string(),
    age: z.number(),
  })
  .required();

export type CreateExampleDTO = z.infer<typeof createExampleSchema>;
