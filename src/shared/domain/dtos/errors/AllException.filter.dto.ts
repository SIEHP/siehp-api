import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const ValidationErrorDetailSchema = z.object({
  field: z.string().describe('Campo que apresentou erro'),
  message: z.string().describe('Mensagem de erro'),
  code: z.string().describe('Código de erro Zod'),
}).describe('Detalhes de erro de validação');

export const AllExceptionFilterSchema = z
  .object({
    message: z.string().describe('Descrição do erro'),
    statusCode: z.number().describe('Código do erro'),
    timestamp: z.string().describe('Timestamp do erro'),
    path: z.string().describe('Caminho do erro'),
    details: z.array(ValidationErrorDetailSchema).optional().describe('Detalhes específicos do erro'),
  })
  .required()
  .describe('Resposta de erro genérico');

export class AllExceptionsFilterDTO extends createZodDto(
  AllExceptionFilterSchema,
) {}
