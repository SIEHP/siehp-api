import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { GetExampleUseCase } from '../../usecases/GetExample.usecase';
import { Response } from 'express';
import { ExampleException } from 'src/shared/domain/errors/Example.exception';
import { ZodValidationPipe } from '../pipes/ZodValidation.pipe';
import {
  CreateExampleDTO,
  createExampleSchema,
} from 'src/shared/domain/dtos/requests/GetExample.request.dto';

@Controller('example')
export class ExampleController {
  constructor(private getExampleUseCase: GetExampleUseCase) {}

  @Post('')
  @UsePipes(new ZodValidationPipe(createExampleSchema))
  async createExample(
    @Body() createExampleSchema: CreateExampleDTO,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.CREATED).json(createExampleSchema);
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
