import { Status } from '@prisma/client';

export interface CreateImageUseCaseDTO {
    title: string;
    url: string;
    user_email: string;
    tags?: string[];
}

export interface CreateImageUseCaseResponseDTO {
    id: number;
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

export interface ListImageUseCaseDTO {
    email: string;
}

export interface ListImageUseCaseResponseDTO extends Array<GetImageUseCaseResponseDTO> {} 
