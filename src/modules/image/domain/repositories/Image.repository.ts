import {
    CreateImageDTO,
    CreateImageResponseDTO,
    DeleteImageDTO,
    DeleteImageResponseDTO,
    FindImageByIdDTO,
    FindImageByIdResponseDTO,
    UpdateImageDTO,
    UpdateImageResponseDTO,
} from '../dtos/repositories/Image.repository.dto';

export interface ImageRepositoryInterface {
    create(data: CreateImageDTO): Promise<CreateImageResponseDTO>;
    findById(data: FindImageByIdDTO): Promise<FindImageByIdResponseDTO>;
    update(data: UpdateImageDTO): Promise<UpdateImageResponseDTO>;
    delete(data: DeleteImageDTO): Promise<DeleteImageResponseDTO>;
} 