import { Status } from '@prisma/client';

export interface CreateImageDTO {
    title: string;
    status: Status;
    url: string;
    created_by: number;
    file_id: number;
    piece_state?: string;
    pick_date?: Date;
    tissue?: string;
    copyright?: string;
    description?: string;
    tags?: string[];
}

export interface CreateImageResponseDTO {
    id: number;
    title: string;
    status: Status;
    url: string;
    piece_state?: string;
    pick_date?: Date;
    tissue?: string;
    copyright?: string;
    description?: string;
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
    title: string;
    status: Status;
    url: string;
    piece_state?: string;
    pick_date?: Date;
    tissue?: string;
    copyright?: string;
    description?: string;
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
    piece_state?: string;
    pick_date?: Date;
    tissue?: string;
    copyright?: string;
    description?: string;
    updated_by: number;
    tags?: string[];
}

export interface UpdateImageResponseDTO {
    id: number;
    title: string;
    status: Status;
    url: string;
    piece_state?: string;
    pick_date?: Date;
    tissue?: string;
    copyright?: string;
    description?: string;
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
    title: string;
    status: Status;
    url: string;
    piece_state?: string;
    pick_date?: Date;
    tissue?: string;
    copyright?: string;
    description?: string;
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

export interface FindAllImagesDTO {
    user_id: number;
} 