import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import { TagRepository } from '../db/repositories/Tag.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { DeleteImageTagUseCaseDTO, DeleteImageTagUseCaseResponseDTO } from '../../domain/dtos/usecases/Tag.usecase.dto';
import { UserRepository } from 'src/modules/user/infra/db/repositories/User.repository';
import { NotFoundUserException } from 'src/modules/user/domain/errors/NotFoundUser.exception';

@Injectable()
export class DeleteImageTagUseCase implements UseCaseInterface {
    constructor(
        private tagRepository: TagRepository,
        private userService: UserService,
        private userRepository: UserRepository,
    ) {}

    async execute({
        image_id,
        tag_id,
        user_email,
    }: DeleteImageTagUseCaseDTO): Promise<DeleteImageTagUseCaseResponseDTO> {
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

        const imageTag = await this.tagRepository.deleteImageTag({
            image_id,
            tag_id,
            updated_by: user.id,
        });

        return imageTag;
    }
} 