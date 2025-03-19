import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { Status } from '@prisma/client';

const tagSchema = z.object({
    id: z.number(),
    name: z.string(),
    status: z.nativeEnum(Status),
    created_at: z.date(),
    updated_at: z.date(),
    created_by: z.number(),
    updated_by: z.number().nullable(),
});

const imageTagSchema = z.object({
    id: z.number(),
    image_id: z.number(),
    tag_id: z.number(),
    status: z.nativeEnum(Status),
    created_at: z.date(),
    updated_at: z.date(),
    created_by: z.number(),
    updated_by: z.number().nullable(),
});

export const createTagBodySchema = z.object({
    name: z.string(),
}).required();

export const updateTagBodySchema = z.object({
    name: z.string().optional(),
    status: z.nativeEnum(Status).optional(),
}).required();

export const createImageTagBodySchema = z.object({
    image_id: z.number(),
    tag_id: z.number(),
}).required();

export class CreateTagBodyDTO extends createZodDto(createTagBodySchema) {}
export class UpdateTagBodyDTO extends createZodDto(updateTagBodySchema) {}
export class CreateImageTagBodyDTO extends createZodDto(createImageTagBodySchema) {}
export class TagResponseDTO extends createZodDto(tagSchema) {}
export class ImageTagResponseDTO extends createZodDto(imageTagSchema) {} 