import { Status } from '@prisma/client';

export interface CreateImageDTO {
    file_id: number;
    title: string;
    status: Status;
    url: string;
    created_by: number;
    tags?: string[];
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
    tags?: {
        id: number;
        name: string;
        status: Status;
    }[];
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
    tags?: {
        id: number;
        name: string;
        status: Status;
    }[];
}

export interface UpdateImageDTO {
    id: number;
    title?: string;
    status?: Status;
    url?: string;
    updated_by: number;
    tags?: string[];
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
    tags?: {
        id: number;
        name: string;
        status: Status;
    }[];
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
    tags?: {
        id: number;
        name: string;
        status: Status;
    }[];
} 