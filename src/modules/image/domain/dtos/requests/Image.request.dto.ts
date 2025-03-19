import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { Status } from '@prisma/client';

const imageSchema = z.object({
    id: z.number(),
    file_id: z.number(),
    title: z.string(),
    status: z.nativeEnum(Status),
    url: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    created_by: z.number(),
    updated_by: z.number().nullable(),
});

export const createImageBodySchema = z.object({
    file_id: z.number(),
    title: z.string(),
    url: z.string(),
}).required();

export const updateImageBodySchema = z.object({
    title: z.string().optional(),
    status: z.nativeEnum(Status).optional(),
}).required();

export class CreateImageBodyDTO extends createZodDto(createImageBodySchema) {}
export class UpdateImageBodyDTO extends createZodDto(updateImageBodySchema) {}
export class ImageResponseDTO extends createZodDto(imageSchema) {} 