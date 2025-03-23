import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import { TagRepository } from '../db/repositories/Tag.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { GetTagUseCaseDTO, GetTagUseCaseResponseDTO } from '../../domain/dtos/usecases/Tag.usecase.dto';

@Injectable()
export class GetTagUseCase implements UseCaseInterface {
    constructor(
        private tagRepository: TagRepository,
        private userService: UserService,
    ) {}

    async execute({
        id,
        user_email,
    }: GetTagUseCaseDTO): Promise<GetTagUseCaseResponseDTO> {
        const checkUserPermission = await this.userService.checkUserPermissions({
            user_email,
            neededPermissions: ['ACESSAR_IMAGENS'],
        });

        if (!checkUserPermission.hasPermission) {
            throw new InvalidPermissionsException({
                permissions: checkUserPermission.notIncludedPermissions,
            });
        }

        const tag = await this.tagRepository.findById({ id });

        return tag;
    }
} 