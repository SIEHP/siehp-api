import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { Status } from '@prisma/client';

const imageSchema = z.object({
    id: z.number(),
    title: z.string(),
    status: z.nativeEnum(Status),
    url: z.string(),
    created_at: z.union([z.string(), z.date()]),
    updated_at: z.union([z.string(), z.date()]),
    created_by: z.number(),
    updated_by: z.number().nullable(),
    tags: z.array(z.object({
        id: z.number(),
        name: z.string(),
        status: z.nativeEnum(Status),
    })).optional(),
});

export const createImageBodySchema = z.object({
    title: z.string(),
    url: z.string(),
    tags: z.array(z.string()).optional(),
}).required();

export const updateImageBodySchema = z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    tags: z.array(z.string()).optional(),
}).required();

export class CreateImageBodyDTO extends createZodDto(createImageBodySchema) {}
export class UpdateImageBodyDTO extends createZodDto(updateImageBodySchema) {}
export class ImageResponseDTO extends createZodDto(imageSchema) {} 