import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/user/infra/http/guards/Jwt.guard';
import { CreateTagUseCase } from '../../usecases/CreateTag.usecase';
import { GetTagUseCase } from '../../usecases/GetTag.usecase';
import { UpdateTagUseCase } from '../../usecases/UpdateTag.usecase';
import { DeleteTagUseCase } from '../../usecases/DeleteTag.usecase';
import { CreateImageTagUseCase } from '../../usecases/CreateImageTag.usecase';
import { DeleteImageTagUseCase } from '../../usecases/DeleteImageTag.usecase';
import { GetTagsByImageUseCase } from '../../usecases/GetTagsByImage.usecase';
import { CreateTagBodyDTO, CreateImageTagBodyDTO, TagResponseDTO, UpdateTagBodyDTO, ImageTagResponseDTO } from 'src/modules/tag/domain/dtos/requests/Tag.request.dto';

@Controller('tag')
@ApiTags('Tag')
@ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro disparado.',
    type: AllExceptionsFilterDTO,
})
export class TagController {
    constructor(
        private createTagUseCase: CreateTagUseCase,
        private getTagUseCase: GetTagUseCase,
        private updateTagUseCase: UpdateTagUseCase,
        private deleteTagUseCase: DeleteTagUseCase,
        private createImageTagUseCase: CreateImageTagUseCase,
        private deleteImageTagUseCase: DeleteImageTagUseCase,
        private getTagsByImageUseCase: GetTagsByImageUseCase,
    ) {}

    @UseGuards(AuthGuard)
    @ApiBearerAuth('user-token')
    @Post()
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Tag criada com sucesso.',
        type: TagResponseDTO,
    })
    @ApiOperation({ summary: 'Criar uma nova tag' })
    async create(@Body() body: CreateTagBodyDTO, @Req() req: Request, @Res() res: Response) {
        const tag = await this.createTagUseCase.execute({
            name: body.name,
            user_email: req.user.email,
        });

        return res.status(HttpStatus.CREATED).json(tag);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('user-token')
    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Tag encontrada com sucesso.',
        type: TagResponseDTO,
    })
    @ApiOperation({ summary: 'Buscar uma tag pelo ID' })
    async findById(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        const tag = await this.getTagUseCase.execute({
            id,
            user_email: req.user.email,
        });

        return res.status(HttpStatus.OK).json(tag);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('user-token')
    @Put(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Tag atualizada com sucesso.',
        type: TagResponseDTO,
    })
    @ApiOperation({ summary: 'Atualizar uma tag' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateTagBodyDTO,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const tag = await this.updateTagUseCase.execute({
            id,
            ...body,
            user_email: req.user.email,
        });

        return res.status(HttpStatus.OK).json(tag);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('user-token')
    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Tag excluída com sucesso.',
        type: TagResponseDTO,
    })
    @ApiOperation({ summary: 'Excluir uma tag' })
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        const tag = await this.deleteTagUseCase.execute({
            id,
            user_email: req.user.email,
        });

        return res.status(HttpStatus.OK).json(tag);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('user-token')
    @Post('image')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Associação de tag com imagem criada com sucesso.',
        type: ImageTagResponseDTO,
    })
    @ApiOperation({ summary: 'Associar uma tag a uma imagem' })
    async createImageTag(@Body() body: CreateImageTagBodyDTO, @Req() req: Request, @Res() res: Response) {
        const imageTag = await this.createImageTagUseCase.execute({
            image_id: body.image_id,
            tag_id: body.tag_id,
            user_email: req.user.email,
        });

        return res.status(HttpStatus.CREATED).json(imageTag);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('user-token')
    @Delete('image/:image_id/:tag_id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Associação de tag com imagem excluída com sucesso.',
        type: ImageTagResponseDTO,
    })
    @ApiOperation({ summary: 'Remover associação de tag com imagem' })
    async deleteImageTag(
        @Param('image_id', ParseIntPipe) image_id: number,
        @Param('tag_id', ParseIntPipe) tag_id: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const imageTag = await this.deleteImageTagUseCase.execute({
            image_id,
            tag_id,
            user_email: req.user.email,
        });

        return res.status(HttpStatus.OK).json(imageTag);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('user-token')
    @Get('image/:image_id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Tags da imagem encontradas com sucesso.',
        type: [TagResponseDTO],
    })
    @ApiOperation({ summary: 'Buscar tags de uma imagem' })
    async findTagsByImage(@Param('image_id', ParseIntPipe) image_id: number, @Req() req: Request, @Res() res: Response) {
        const tags = await this.getTagsByImageUseCase.execute({
            image_id,
            user_email: req.user.email,
        });

        return res.status(HttpStatus.OK).json(tags);
    }
} 