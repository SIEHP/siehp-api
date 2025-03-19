import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import { ImageRepository } from '../db/repositories/Image.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { UpdateImageUseCaseDTO, UpdateImageUseCaseResponseDTO } from '../../domain/dtos/usecases/Image.usecase.dto';
import { UserRepository } from 'src/modules/user/infra/db/repositories/User.repository';
import { NotFoundUserException } from 'src/modules/user/domain/errors/NotFoundUser.exception';

@Injectable()
export class UpdateImageUseCase implements UseCaseInterface {
    constructor(
        private imageRepository: ImageRepository,
        private userService: UserService,
        private userRepository: UserRepository,
    ) {}

    async execute({
        id,
        title,
        status,
        user_email,
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

        const image = await this.imageRepository.update({
            id,
            title,
            status,
            updated_by: user.id,
        });

        return image;
    }
} 