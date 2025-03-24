import { Module } from '@nestjs/common';
import { ImageController } from '../http/controllers/Image.controller';
import { ImageRepository } from '../db/repositories/Image.repository';
import { CreateImageUseCase } from '../usecases/CreateImage.usecase';
import { GetImageUseCase } from '../usecases/GetImage.usecase';
import { UpdateImageUseCase } from '../usecases/UpdateImage.usecase';
import { DeleteImageUseCase } from '../usecases/DeleteImage.usecase';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { UserRepository } from 'src/modules/user/infra/db/repositories/User.repository';
import { TagRepository } from 'src/modules/tag/infra/db/repositories/Tag.repository';

@Module({
    controllers: [ImageController],
    providers: [
        ImageRepository,
        CreateImageUseCase,
        GetImageUseCase,
        UpdateImageUseCase,
        DeleteImageUseCase,
        UserService,
        UserRepository,
        TagRepository,
    ],
})
export class ImageModule {} 