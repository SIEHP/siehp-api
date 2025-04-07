import { Status } from '@prisma/client';

export interface CreateTagDTO {
    name: string;
    status: Status;
    created_by: number;
}

export interface CreateTagResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
}

export interface FindTagByIdDTO {
    id: number;
}

export interface FindTagByIdResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
}

export interface FindTagByNameDTO {
    name: string;
}

export interface FindTagByNameResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
}

export interface UpdateTagDTO {
    id: number;
    name?: string;
    status?: Status;
    updated_by: number;
}

export interface UpdateTagResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
}

export interface DeleteTagDTO {
    id: number;
    updated_by: number;
}

export interface DeleteTagResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
}

export interface CreateImageTagDTO {
    image_id: number;
    tag_id: number;
    created_by: number;
}

export interface CreateImageTagResponseDTO {
    id: number;
    image_id: number;
    tag_id: number;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
}

export interface DeleteImageTagDTO {
    image_id: number;
    tag_id: number;
    updated_by: number;
}

export interface DeleteImageTagResponseDTO {
    id: number;
    image_id: number;
    tag_id: number;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
}

export interface FindTagsByImageIdDTO {
    image_id: number;
}

export interface FindTagsByImageIdResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
}

export interface FindAllTagsDTO {
    // Vazio, pois não precisamos de parâmetros para buscar todas as tags
}

export interface FindAllTagsResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
} 