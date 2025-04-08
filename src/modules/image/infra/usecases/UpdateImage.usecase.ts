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
import { ZodError, z } from 'zod';

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
        tags = [],
    }: UpdateImageUseCaseDTO): Promise<UpdateImageUseCaseResponseDTO> {
        // Validar campos obrigatórios explicitamente
        const requiredFieldsSchema = z.object({
            id: z.number({ required_error: "ID da imagem é obrigatório" }),
            user_email: z.string({ required_error: "Email do usuário é obrigatório" }).email("Email do usuário deve ser válido"),
        });
        
        try {
            requiredFieldsSchema.parse({ id, user_email });
        } catch (error) {
            if (error instanceof ZodError) {
                throw error;
            }
        }
        
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

        // Garantir que tags seja sempre um array
        const processedTags = Array.isArray(tags) ? tags : [];
        
        // Tratamento de tags modificado para evitar o erro de unicidade
        if (processedTags.length > 0) {
            // Manter um registro de todas as tags que serão atribuídas à imagem
            const updatedImageTags = [];
            
            // Encontrar ou criar todas as tags necessárias
            const tagObjects = await Promise.all(
                processedTags.map(async (tagName) => {
                    try {
                        // Verificar se a tag já existe
                        const existingTag = await this.tagRepository.findByName({ name: tagName });
                        return existingTag;
                    } catch (error) {
                        if (error instanceof NotFoundTagException) {
                            // Criar nova tag se não existir
                            const newTag = await this.tagRepository.create({
                                name: tagName,
                                status: 'ACTIVE',
                                created_by: user.id,
                            });
                            return newTag;
                        }
                        throw error;
                    }
                })
            );
            
            // Identificar quais tags já estão associadas e quais precisam ser adicionadas
            const existingTagIds = existingTags.map(tag => tag.id);
            
            // Para cada tag que deve estar na imagem
            for (const tagObj of tagObjects) {
                // Verificar se já está associada
                const isAlreadyAssociated = existingTagIds.includes(tagObj.id);
                
                if (!isAlreadyAssociated) {
                    // Verificar se existe uma associação inativa para reativar
                    const inactiveAssociation = await this.tagRepository.findInactiveImageTag({
                        image_id: id,
                        tag_id: tagObj.id
                    });
                    
                    if (inactiveAssociation) {
                        // Reativar a associação existente
                        try {
                            await this.tagRepository.reactivateImageTag({
                                image_id: id,
                                tag_id: tagObj.id,
                                updated_by: user.id
                            });
                        } catch (error) {
                            console.warn(`Erro ao reativar tag ${tagObj.id} para a imagem ${id}:`, error);
                            // Continuar com as próximas tags mesmo se houver erro
                        }
                    } else {
                        // Se não existe associação, criar nova
                        try {
                            await this.tagRepository.createImageTag({
                                image_id: id,
                                tag_id: tagObj.id,
                                created_by: user.id,
                            });
                        } catch (error) {
                            console.warn(`Erro ao associar tag ${tagObj.id} à imagem ${id}:`, error);
                            // Continuar com as próximas tags mesmo se houver erro
                        }
                    }
                }
                // Adicionar à lista de tags atualizadas
                updatedImageTags.push(tagObj);
            }
            
            // Identificar tags que precisam ser removidas (estão na imagem mas não no array de tags enviado)
            const newTagIds = tagObjects.map(tag => tag.id);
            const tagsToRemove = existingTags.filter(tag => !newTagIds.includes(tag.id));
            
            // Remover as associações que não são mais necessárias
            await Promise.all(
                tagsToRemove.map(tag => 
                    this.tagRepository.deleteImageTag({
                        image_id: id,
                        tag_id: tag.id,
                        updated_by: user.id,
                    })
                )
            );
            
            // Atualizar as tags da imagem
            image.tags = updatedImageTags;
        } else {
            // Se o array de tags estiver vazio, remover todas as tags
            await Promise.all(
                existingTags.map((tag) =>
                    this.tagRepository.deleteImageTag({
                        image_id: id,
                        tag_id: tag.id,
                        updated_by: user.id,
                    }),
                ),
            );
            image.tags = [];
        }

        const updatedImage = await this.imageRepository.update({
            id,
            title,
            url: url || image.url,
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