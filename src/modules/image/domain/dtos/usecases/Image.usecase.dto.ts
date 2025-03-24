import { Status } from '@prisma/client';

export interface CreateImageUseCaseDTO {
    file_id: number;
    title: string;
    url: string;
    user_email: string;
    tags?: string[];
}

export interface CreateImageUseCaseResponseDTO {
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

export interface GetImageUseCaseDTO {
    id: number;
    user_email: string;
}

export interface GetImageUseCaseResponseDTO {
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

export interface UpdateImageUseCaseDTO {
    id: number;
    title?: string;
    url?: string;
    user_email: string;
    tags?: string[];
}

export interface UpdateImageUseCaseResponseDTO {
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

export interface DeleteImageUseCaseDTO {
    id: number;
    user_email: string;
}

export interface DeleteImageUseCaseResponseDTO {
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