import { Status } from '@prisma/client';

export interface CreateImageDTO {
    file_id: number;
    title: string;
    status: Status;
    url: string;
    created_by: number;
}

export interface CreateImageResponseDTO {
    id: number;
    file_id: number;
    title: string;
    status: Status;
    url: string;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
}

export interface FindImageByIdDTO {
    id: number;
}

export interface FindImageByIdResponseDTO {
    id: number;
    file_id: number;
    title: string;
    status: Status;
    url: string;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
}

export interface UpdateImageDTO {
    id: number;
    title?: string;
    status?: Status;
    updated_by: number;
}

export interface UpdateImageResponseDTO {
    id: number;
    file_id: number;
    title: string;
    status: Status;
    url: string;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
}

export interface DeleteImageDTO {
    id: number;
    updated_by: number;
}

export interface DeleteImageResponseDTO {
    id: number;
    file_id: number;
    title: string;
    status: Status;
    url: string;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
} 