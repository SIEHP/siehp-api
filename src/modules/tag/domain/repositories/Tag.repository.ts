import {
    CreateImageTagDTO,
    CreateImageTagResponseDTO,
    CreateTagDTO,
    CreateTagResponseDTO,
    DeleteImageTagDTO,
    DeleteImageTagResponseDTO,
    DeleteTagDTO,
    DeleteTagResponseDTO,
    FindAllTagsDTO,
    FindAllTagsResponseDTO,
    FindTagByIdDTO,
    FindTagByIdResponseDTO,
    FindTagByNameDTO,
    FindTagByNameResponseDTO,
    FindTagsByImageIdDTO,
    FindTagsByImageIdResponseDTO,
    UpdateTagDTO,
    UpdateTagResponseDTO,
} from '../dtos/repositories/Tag.repository.dto';

export interface TagRepositoryInterface {
    create(data: CreateTagDTO): Promise<CreateTagResponseDTO>;
    findById(data: FindTagByIdDTO): Promise<FindTagByIdResponseDTO>;
    findByName(data: FindTagByNameDTO): Promise<FindTagByNameResponseDTO>;
    findAll(): Promise<FindAllTagsResponseDTO[]>;
    update(data: UpdateTagDTO): Promise<UpdateTagResponseDTO>;
    delete(data: DeleteTagDTO): Promise<DeleteTagResponseDTO>;
    createImageTag(data: CreateImageTagDTO): Promise<CreateImageTagResponseDTO>;
    deleteImageTag(data: DeleteImageTagDTO): Promise<DeleteImageTagResponseDTO>;
    findTagsByImageId(data: FindTagsByImageIdDTO): Promise<FindTagsByImageIdResponseDTO[]>;
} 