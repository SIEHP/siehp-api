import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import { ImageRepository } from '../db/repositories/Image.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { GetImageUseCaseDTO, GetImageUseCaseResponseDTO } from '../../domain/dtos/usecases/Image.usecase.dto';
import { TagRepository } from 'src/modules/tag/infra/db/repositories/Tag.repository';
import { NotFoundImageException } from '../../domain/errors/NotFoundImage.exception';

@Injectable()
export class GetImageUseCase implements UseCaseInterface {
    constructor(
        private imageRepository: ImageRepository,
        private userService: UserService,
        private tagRepository: TagRepository,
    ) {}

    async execute({
        id,
        user_email,
    }: GetImageUseCaseDTO): Promise<GetImageUseCaseResponseDTO> {
        const checkUserPermission = await this.userService.checkUserPermissions({
            user_email,
            neededPermissions: ['ACESSAR_IMAGENS'],
        });

        if (!checkUserPermission.hasPermission) {
            throw new InvalidPermissionsException({
                permissions: checkUserPermission.notIncludedPermissions,
            });
        }

        const image = await this.imageRepository.findById({ id });
        
        if (!image) {
            throw new NotFoundImageException();
        }

        const tags = await this.tagRepository.findTagsByImageId({ image_id: id });
        image.tags = tags;

        return image;
    }
} 