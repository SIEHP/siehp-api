import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import { ImageRepository } from '../db/repositories/Image.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { UserRepository } from 'src/modules/user/infra/db/repositories/User.repository';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { NotFoundUserException } from 'src/modules/user/domain/errors/NotFoundUser.exception';
import { UpdateImageUseCaseDTO, UpdateImageUseCaseResponseDTO } from '../../domain/dtos/usecases/Image.usecase.dto';
import { TagRepository } from 'src/modules/tag/infra/db/repositories/Tag.repository';
import { NotFoundImageException } from '../../domain/errors/NotFoundImage.exception';
import { NotFoundTagException } from 'src/modules/tag/domain/errors/NotFoundTag.exception';

@Injectable()
export class UpdateImageUseCase implements UseCaseInterface {
    constructor(
        private imageRepository: ImageRepository,
        private userService: UserService,
        private userRepository: UserRepository,
        private tagRepository: TagRepository,
    ) {}

    async execute({
        id,
        title,
        url,
        piece_state,
        pick_date,
        tissue,
        copyright,
        description,
        user_email,
        tags,
    }: UpdateImageUseCaseDTO): Promise<UpdateImageUseCaseResponseDTO> {
        const checkUserPermission = await this.userService.checkUserPermissions({
            user_email,
            neededPermissions: ['MANTER_IMAGENS'],
        });

        if (!checkUserPermission.hasPermission) {
            throw new InvalidPermissionsException({
                permissions: checkUserPermission.notIncludedPermissions,
            });
        }

        const user = await this.userRepository.findByEmail({ email: user_email });
        if (!user) {
            throw new NotFoundUserException();
        }

        const image = await this.imageRepository.findById({ id });
        if (!image) {
            throw new NotFoundImageException();
        }

        // Get existing tags
        const existingTags = await this.tagRepository.findTagsByImageId({ image_id: id });
        image.tags = existingTags;

        if (tags !== undefined) {
            // Delete existing image tags
            await Promise.all(
                existingTags.map((tag) =>
                    this.tagRepository.deleteImageTag({
                        image_id: id,
                        tag_id: tag.id,
                        updated_by: user.id,
                    }),
                ),
            );

            if (tags.length > 0) {
                // Create or find tags and associate them
                const imageTags = await Promise.all(
                    tags.map(async (tagName) => {
                        try {
                            const existingTag = await this.tagRepository.findByName({ name: tagName });
                            return existingTag;
                        } catch (error) {
                            if (error instanceof NotFoundTagException) {
                                const newTag = await this.tagRepository.create({
                                    name: tagName,
                                    status: 'ACTIVE',
                                    created_by: user.id,
                                });
                                return newTag;
                            }
                            throw error;
                        }
                    }),
                );

                await Promise.all(
                    imageTags.map((tag) =>
                        this.tagRepository.createImageTag({
                            image_id: id,
                            tag_id: tag.id,
                            created_by: user.id,
                        }),
                    ),
                );

                image.tags = imageTags;
            } else {
                image.tags = [];
            }
        }

        const updatedImage = await this.imageRepository.update({
            id,
            title,
            url,
            piece_state,
            pick_date: pick_date ? new Date(pick_date) : undefined,
            tissue,
            copyright,
            description,
            updated_by: user.id,
        });

        return { ...updatedImage, tags: image.tags };
    }
} 