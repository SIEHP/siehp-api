import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { GetExampleUseCase } from '../../../usecases/GetExample.usecase';
import { Response } from 'express';
import { ExampleException } from 'src/shared/domain/errors/Example.exception';
import { CreateExampleBodyDTO } from 'src/shared/domain/dtos/requests/GetExample.request.dto';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationException } from 'src/shared/domain/errors/Validation.exception';
import { CheckUserPermissionsUseCase } from 'src/modules/user/infra/usecases/CheckUserPermissions.usecase';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';

@Controller('example')
@ApiTags('Example')
@ApiResponse({
  status: new ValidationException().getStatus(),
  description: new ValidationException().message,
  type: AllExceptionsFilterDTO,
})
export class ExampleController {
  constructor(
    private getExampleUseCase: GetExampleUseCase,
    private checkUserPermissionsUseCase: CheckUserPermissionsUseCase,
  ) {}

  @Post('')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Exemplo criado com sucesso',
    type: CreateExampleBodyDTO,
  })
  @ApiOperation({ summary: 'Método de criação' })
  async createExample(
    @Body() createExampleBody: CreateExampleBodyDTO,
    @Res() res: Response,
  ) {
    const checkUserPermission = await this.checkUserPermissionsUseCase.execute({
      user_id: createExampleBody.id,
      neededPermissions: ['ACESSAR_LOGS', 'MANTER_TURMAS'],
    });

    if (checkUserPermission.hasPermission) {
      console.log('hasPermissions', checkUserPermission);
      const example = await this.getExampleUseCase.execute(createExampleBody);
      return res.status(HttpStatus.CREATED).json(example);
    }

    throw new InvalidPermissionsException({
      permissions: checkUserPermission.notIncludedPermissions,
    });
  }

  @Get('')
  async getExample(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.NO_CONTENT);
  }

  @Get('2')
  @ApiResponse({
    status: new ExampleException().getStatus(),
    description: new ExampleException().message,
    type: AllExceptionsFilterDTO,
  })
  getExceptionExample() {
    throw new ExampleException();
  }
}
