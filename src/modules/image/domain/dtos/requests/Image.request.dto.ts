import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { Status } from '@prisma/client';

const imageSchema = z.object({
    id: z.number(),
    title: z.string(),
    status: z.nativeEnum(Status),
    url: z.string(),
    piece_state: z.string().nullable().optional(),
    pick_date: z.union([z.string(), z.date()]).nullable().optional(),
    tissue: z.string().nullable().optional(),
    copyright: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
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
    piece_state: z.string().optional(),
    pick_date: z.string().or(z.date()).optional().transform(val => val ? new Date(val) : undefined),
    tissue: z.string().optional(),
    copyright: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
}).required();

export const updateImageBodySchema = z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    piece_state: z.string().optional(),
    pick_date: z.string().or(z.date()).optional().transform(val => val ? new Date(val) : undefined),
    tissue: z.string().optional(),
    copyright: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
}).required();

export class CreateImageBodyDTO extends createZodDto(createImageBodySchema) {}
export class UpdateImageBodyDTO extends createZodDto(updateImageBodySchema) {}
export class ImageResponseDTO extends createZodDto(imageSchema) {} 