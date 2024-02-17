import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { GetExampleUseCase } from '../../usecases/GetExample.usecase';
import { Response } from 'express';
import { ExampleException } from 'src/shared/domain/errors/Example.exception';
import { CreateExampleDTO } from 'src/shared/domain/dtos/requests/GetExample.request.dto';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter';
import { ApiResponse } from '@nestjs/swagger';

@Controller('example')
@ApiResponse({
  status: HttpStatus.UNPROCESSABLE_ENTITY,
  description: 'Erro de validação',
  type: AllExceptionsFilterDTO,
})
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Não autorizado, token inválido',
  type: AllExceptionsFilterDTO,
})
export class ExampleController {
  constructor(private getExampleUseCase: GetExampleUseCase) {}

  @Post('')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Exemplo criado com sucesso',
    type: CreateExampleDTO,
  })
  async createExample(
    @Body() createExampleBody: CreateExampleDTO,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.CREATED).json(createExampleBody);
  }

  @Get('')
  async getExample(@Req() req: Request, @Res() res: Response) {
    console.log(req.body);

    const example = await this.getExampleUseCase.execute({});
    return res.status(HttpStatus.ACCEPTED).json(example);
  }

  @Get('2')
  getExceptionExample() {
    throw new ExampleException();
  }
}
