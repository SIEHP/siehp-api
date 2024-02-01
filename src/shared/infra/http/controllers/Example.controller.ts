import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { GetExampleUseCase } from '../../usecases/GetExample.usecase';
import { Response } from 'express';

@Controller('example')
export class ExampleController {
  constructor(private getExampleUseCase: GetExampleUseCase) {}

  @Get('')
  async getExample(@Req() req: Request, @Res() res: Response) {
    console.log(req.body);

    const example = await this.getExampleUseCase.execute({});
    return res.status(HttpStatus.ACCEPTED).json(example);
  }

  @Get('2')
  getExample2() {
    return 'Hello World 2!';
  }
}
