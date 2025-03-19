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
import { CreateImageUseCase } from '../../usecases/CreateImage.usecase';
import { GetImageUseCase } from '../../usecases/GetImage.usecase';
import { UpdateImageUseCase } from '../../usecases/UpdateImage.usecase';
import { DeleteImageUseCase } from '../../usecases/DeleteImage.usecase';
import { CreateImageBodyDTO, ImageResponseDTO, UpdateImageBodyDTO } from 'src/modules/image/domain/dtos/requests/Image.request.dto';

@Controller('image')
@ApiTags('Image')
@ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro disparado.',
    type: AllExceptionsFilterDTO,
})
export class ImageController {
    constructor(
        private createImageUseCase: CreateImageUseCase,
        private getImageUseCase: GetImageUseCase,
        private updateImageUseCase: UpdateImageUseCase,
        private deleteImageUseCase: DeleteImageUseCase,
    ) {}

    @UseGuards(AuthGuard)
    @ApiBearerAuth('user-token')
    @Post()
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Imagem criada com sucesso.',
        type: ImageResponseDTO,
    })
    @ApiOperation({ summary: 'Criar uma nova imagem' })
    async create(@Body() body: CreateImageBodyDTO, @Req() req: Request, @Res() res: Response) {
        const image = await this.createImageUseCase.execute({
            ...body,
            user_email: req.user.email,
        });

        return res.status(HttpStatus.CREATED).json(image);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('user-token')
    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Imagem encontrada com sucesso.',
        type: ImageResponseDTO,
    })
    @ApiOperation({ summary: 'Buscar uma imagem pelo ID' })
    async findById(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        const image = await this.getImageUseCase.execute({
            id,
            user_email: req.user.email,
        });

        return res.status(HttpStatus.OK).json(image);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('user-token')
    @Put(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Imagem atualizada com sucesso.',
        type: ImageResponseDTO,
    })
    @ApiOperation({ summary: 'Atualizar uma imagem' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateImageBodyDTO,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const image = await this.updateImageUseCase.execute({
            id,
            ...body,
            user_email: req.user.email,
        });

        return res.status(HttpStatus.OK).json(image);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('user-token')
    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Imagem excluída com sucesso.',
        type: ImageResponseDTO,
    })
    @ApiOperation({ summary: 'Excluir uma imagem' })
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
        const image = await this.deleteImageUseCase.execute({
            id,
            user_email: req.user.email,
        });

        return res.status(HttpStatus.OK).json(image);
    }
} 