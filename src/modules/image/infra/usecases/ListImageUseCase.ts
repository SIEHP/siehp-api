import { UseCaseInterface } from "src/shared/domain/protocols/UseCase.protocol";
import { ImageRepository } from "../db/repositories/Image.repository";
import { Injectable } from "@nestjs/common";
import { ListImageUseCaseResponseDTO,ListImageUseCaseDTO } from "../../domain/dtos/usecases/Image.usecase.dto";
import { InvalidPermissionsException } from "src/modules/user/domain/errors/InvalidPermissions.exception";
import { UserService } from "src/modules/user/infra/services/User.service";
import { UserRepository } from "src/modules/user/infra/db/repositories/User.repository";
import { NotFoundUserException } from "src/modules/user/domain/errors/NotFoundUser.exception";
import { TagRepository } from "src/modules/tag/infra/db/repositories/Tag.repository";

@Injectable()
export class ListImageUseCase implements UseCaseInterface {
    constructor(
        private imageRepository: ImageRepository,
        private userService: UserService,
        private userRepository: UserRepository,
        private tagRepository: TagRepository,
    ) {}
    
    async execute({email}: ListImageUseCaseDTO): Promise<ListImageUseCaseResponseDTO> {
        
        const checkUserPermission = await this.userService.checkUserPermissions({
            user_email: email,
            neededPermissions: ['MANTER_IMAGENS'],
        });

        if (!checkUserPermission.hasPermission) {
            throw new InvalidPermissionsException({
                permissions: checkUserPermission.notIncludedPermissions,
            });
        }

        const user = await this.userRepository.findByEmail({ email });

        if (!user) {
            throw new NotFoundUserException();
        }

        const images = await this.imageRepository.findAll({
            user_id: user.id,
        });

        // Buscar e adicionar as tags de cada imagem
        const imagesWithTags = await Promise.all(
            images.map(async (image) => {
                const tags = await this.tagRepository.findTagsByImageId({ image_id: image.id });
                return { ...image, tags };
            })
        );

        return imagesWithTags;
    }
}