import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { TagRepositoryInterface } from 'src/modules/tag/domain/repositories/Tag.repository';
import {
    CreateImageTagDTO,
    CreateImageTagResponseDTO,
    CreateTagDTO,
    CreateTagResponseDTO,
    DeleteImageTagDTO,
    DeleteImageTagResponseDTO,
    DeleteTagDTO,
    DeleteTagResponseDTO,
    FindAllTagsDTO,
    FindAllTagsResponseDTO,
    FindTagByIdDTO,
    FindTagByIdResponseDTO,
    FindTagByNameDTO,
    FindTagByNameResponseDTO,
    FindTagsByImageIdDTO,
    FindTagsByImageIdResponseDTO,
    UpdateTagDTO,
    UpdateTagResponseDTO,
} from 'src/modules/tag/domain/dtos/repositories/Tag.repository.dto';
import { NotFoundTagException } from 'src/modules/tag/domain/errors/NotFoundTag.exception';

@Injectable()
export class TagRepository implements TagRepositoryInterface {
    constructor(private readonly prisma: PrismaProvider) {}

    async create(data: CreateTagDTO): Promise<CreateTagResponseDTO> {
        const tag = await this.prisma.tag.create({
            data: {
                name: data.name,
                status: data.status,
                created_by: data.created_by,
            },
        });

        return tag;
    }

    async findById(data: FindTagByIdDTO): Promise<FindTagByIdResponseDTO> {
        const tag = await this.prisma.tag.findUnique({
            where: {
                id: data.id,
            },
        });

        return tag;
    }

    async findByName(data: FindTagByNameDTO): Promise<FindTagByNameResponseDTO> {
        const tag = await this.prisma.tag.findFirst({
            where: {
                name: data.name,
                status: 'ACTIVE',
            },
        });

        if (!tag) {
            throw new NotFoundTagException();
        }

        return tag;
    }

    async update(data: UpdateTagDTO): Promise<UpdateTagResponseDTO> {
        const tag = await this.prisma.tag.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                status: data.status,
                updated_by: data.updated_by,
            },
        });

        return tag;
    }

    async delete(data: DeleteTagDTO): Promise<DeleteTagResponseDTO> {
        const tag = await this.prisma.tag.update({
            where: {
                id: data.id,
            },
            data: {
                status: 'DELETED',
                updated_by: data.updated_by,
            },
        });

        return tag;
    }

    async createImageTag(data: CreateImageTagDTO): Promise<CreateImageTagResponseDTO> {
        const imageTag = await this.prisma.imageTag.create({
            data: {
                image_id: data.image_id,
                tag_id: data.tag_id,
                status: 'ACTIVE',
                created_by: data.created_by,
            },
        });

        return imageTag;
    }

    async deleteImageTag(data: DeleteImageTagDTO): Promise<DeleteImageTagResponseDTO> {
        const imageTag = await this.prisma.imageTag.update({
            where: {
                image_id_tag_id: {
                    image_id: data.image_id,
                    tag_id: data.tag_id,
                },
            },
            data: {
                status: 'DELETED',
                updated_by: data.updated_by,
            },
        });

        return imageTag;
    }

    async findTagsByImageId(data: FindTagsByImageIdDTO): Promise<FindTagsByImageIdResponseDTO[]> {
        const imageTags = await this.prisma.imageTag.findMany({
            where: {
                image_id: data.image_id,
                status: 'ACTIVE',
            },
            include: {
                tag: true,
            },
        });

        return imageTags.map((imageTag) => imageTag.tag);
    }

    async findAll(): Promise<FindAllTagsResponseDTO[]> {
        const tags = await this.prisma.tag.findMany({
            where: {
                status: 'ACTIVE',
            },
            orderBy: {
                name: 'asc',
            },
        });

        return tags;
    }
} 