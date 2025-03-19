import { Module } from '@nestjs/common';
import { TagController } from '../http/controllers/Tag.controller';
import { TagRepository } from '../db/repositories/Tag.repository';
import { CreateTagUseCase } from '../usecases/CreateTag.usecase';
import { GetTagUseCase } from '../usecases/GetTag.usecase';
import { UpdateTagUseCase } from '../usecases/UpdateTag.usecase';
import { DeleteTagUseCase } from '../usecases/DeleteTag.usecase';
import { CreateImageTagUseCase } from '../usecases/CreateImageTag.usecase';
import { DeleteImageTagUseCase } from '../usecases/DeleteImageTag.usecase';
import { GetTagsByImageUseCase } from '../usecases/GetTagsByImage.usecase';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { UserRepository } from 'src/modules/user/infra/db/repositories/User.repository';

@Module({
    controllers: [TagController],
    providers: [
        TagRepository,
        CreateTagUseCase,
        GetTagUseCase,
        UpdateTagUseCase,
        DeleteTagUseCase,
        CreateImageTagUseCase,
        DeleteImageTagUseCase,
        GetTagsByImageUseCase,
        UserService,
        UserRepository,
    ],
})
 