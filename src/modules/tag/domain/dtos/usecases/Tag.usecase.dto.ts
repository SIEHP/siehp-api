import { Status } from '@prisma/client';

export interface CreateTagUseCaseDTO {
    name: string;
    user_email: string;
}

export interface CreateTagUseCaseResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
}

export interface GetTagUseCaseDTO {
    id: number;
    user_email: string;
}

export interface GetTagUseCaseResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
}

export interface UpdateTagUseCaseDTO {
    id: number;
    name?: string;
    status?: Status;
    user_email: string;
}

export interface UpdateTagUseCaseResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
}

export interface DeleteTagUseCaseDTO {
    id: number;
    user_email: string;
}

export interface DeleteTagUseCaseResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
}

export interface CreateImageTagUseCaseDTO {
    image_id: number;
    tag_id: number;
    user_email: string;
}

export interface CreateImageTagUseCaseResponseDTO {
    id: number;
    image_id: number;
    tag_id: number;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
}

export interface DeleteImageTagUseCaseDTO {
    image_id: number;
    tag_id: number;
    user_email: string;
}

export interface DeleteImageTagUseCaseResponseDTO {
    id: number;
    image_id: number;
    tag_id: number;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
}

export interface GetTagsByImageUseCaseDTO {
    image_id: number;
    user_email: string;
}

export interface GetTagsByImageUseCaseResponseDTO {
    id: number;
    name: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
} 