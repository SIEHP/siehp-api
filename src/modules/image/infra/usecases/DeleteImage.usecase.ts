import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import { ImageRepository } from '../db/repositories/Image.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { DeleteImageUseCaseDTO, DeleteImageUseCaseResponseDTO } from '../../domain/dtos/usecases/Image.usecase.dto';
import { UserRepository } from 'src/modules/user/infra/db/repositories/User.repository';
import { NotFoundUserException } from 'src/modules/user/domain/errors/NotFoundUser.exception';

@Injectable()
export class DeleteImageUseCase implements UseCaseInterface {
    constructor(
        private imageRepository: ImageRepository,
        private userService: UserService,
        private userRepository: UserRepository,
    ) {}

    async execute({
        id,
        user_email,
    }: DeleteImageUseCaseDTO): Promise<DeleteImageUseCaseResponseDTO> {
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

        const image = await this.imageRepository.delete({
            id,
            updated_by: user.id,
        });

        return image;
    }
} 