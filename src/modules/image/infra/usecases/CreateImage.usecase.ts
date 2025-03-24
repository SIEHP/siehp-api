import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import { ImageRepository } from '../db/repositories/Image.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { CreateImageUseCaseDTO, CreateImageUseCaseResponseDTO } from '../../domain/dtos/usecases/Image.usecase.dto';
import { UserRepository } from 'src/modules/user/infra/db/repositories/User.repository';
import { NotFoundUserException } from 'src/modules/user/domain/errors/NotFoundUser.exception';
import { TagRepository } from 'src/modules/tag/infra/db/repositories/Tag.repository';
import { NotFoundTagException } from 'src/modules/tag/domain/errors/NotFoundTag.exception';

@Injectable()
export class CreateImageUseCase implements UseCaseInterface {
    constructor(
        private imageRepository: ImageRepository,
        private userService: UserService,
        private userRepository: UserRepository,
        private tagRepository: TagRepository,
    ) {}

    async execute({
        file_id,
        title,
        url,
        user_email,
        tags,
    }: CreateImageUseCaseDTO): Promise<CreateImageUseCaseResponseDTO> {
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

        const image = await this.imageRepository.create({
            file_id,
            title,
            status: 'ACTIVE',
            url,
            created_by: user.id,
        });

        if (tags && tags.length > 0) {
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
                        image_id: image.id,
                        tag_id: tag.id,
                        created_by: user.id,
                    }),
                ),
            );

            image.tags = imageTags;
        }

        return image;
    }
} 