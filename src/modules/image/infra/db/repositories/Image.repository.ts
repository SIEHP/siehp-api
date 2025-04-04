import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { ImageRepositoryInterface } from 'src/modules/image/domain/repositories/Image.repository';
import {
    CreateImageDTO,
    CreateImageResponseDTO,
    DeleteImageDTO,
    DeleteImageResponseDTO,
    FindImageByIdDTO,
    FindImageByIdResponseDTO,
    UpdateImageDTO,
    UpdateImageResponseDTO,
    FindAllImagesDTO,
} from 'src/modules/image/domain/dtos/repositories/Image.repository.dto';
import { NotFoundImageException } from 'src/modules/image/domain/errors/NotFoundImage.exception';

@Injectable()
export class ImageRepository implements ImageRepositoryInterface {
    constructor(private readonly prisma: PrismaProvider) {}

    async create(data: CreateImageDTO): Promise<CreateImageResponseDTO> {
        const image = await this.prisma.image.create({
            data: {
                title: data.title,
                status: data.status,
                url: data.url,
                piece_state: data.piece_state,
                pick_date: data.pick_date,
                tissue: data.tissue,
                copyright: data.copyright,
                description: data.description,
                created_by: data.created_by,
                file_id: data.file_id,
            },
        });

        return image;
    }

    async findById(data: FindImageByIdDTO): Promise<FindImageByIdResponseDTO> {
        const image = await this.prisma.image.findUnique({
            where: {
                id: data.id,
            },
        });

        if (!image) {
            return null;
        }

        return image;
    }

    async update(data: UpdateImageDTO): Promise<UpdateImageResponseDTO> {
        const image = await this.prisma.image.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                status: data.status,
                url: data.url,
                piece_state: data.piece_state,
                pick_date: data.pick_date,
                tissue: data.tissue,
                copyright: data.copyright,
                description: data.description,
                updated_by: data.updated_by,
            },
        });

        return image;
    }

    async delete(data: DeleteImageDTO): Promise<DeleteImageResponseDTO> {
        const image = await this.prisma.image.update({
            where: {
                id: data.id,
            },
            data: {
                status: 'DELETED',
                updated_by: data.updated_by,
            },
        });

        return image;
    }

    async findAll(data: FindAllImagesDTO): Promise<FindImageByIdResponseDTO[]> {
        const images = await this.prisma.image.findMany({
            where: {
                status: 'ACTIVE',
                created_by: data.user_id,
            },
        });

        return images;
    }
} 