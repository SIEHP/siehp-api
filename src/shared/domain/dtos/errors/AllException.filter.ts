import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

// export class AllExceptionsFilterDTO {
//   message: string;
//   statusCode: number;
//   timestamp: string;
//   path: string;
// }

export const AllExceptionFilterSchema = z
  .object({
    message: z.string().describe('Descrição do erro'),
    statusCode: z.number().describe('Código do erro'),
    timestamp: z.string().describe('Timestamp do erro'),
    path: z.string().describe('Caminho do erro'),
  })
  .required();

export class AllExceptionsFilterDTO extends createZodDto(
  AllExceptionFilterSchema,
) {}
