import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import { TagRepository } from '../db/repositories/Tag.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { GetAllTagsUseCaseDTO, GetAllTagsUseCaseResponseDTO } from '../../domain/dtos/usecases/Tag.usecase.dto';

@Injectable()
export class GetAllTagsUseCase implements UseCaseInterface {
    constructor(
        private tagRepository: TagRepository,
        private userService: UserService,
    ) {}

    async execute({
        user_email,
    }: GetAllTagsUseCaseDTO): Promise<GetAllTagsUseCaseResponseDTO[]> {
        const checkUserPermission = await this.userService.checkUserPermissions({
            user_email,
            neededPermissions: ['ACESSAR_IMAGENS'],
        });

        if (!checkUserPermission.hasPermission) {
            throw new InvalidPermissionsException({
                permissions: checkUserPermission.notIncludedPermissions,
            });
        }

        const tags = await this.tagRepository.findAll();

        return tags;
    }
}
