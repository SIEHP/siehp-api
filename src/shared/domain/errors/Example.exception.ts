import { HttpException, HttpStatus } from '@nestjs/common';

export class ExampleException extends HttpException {
  constructor() {
    super('Example', HttpStatus.I_AM_A_TEAPOT);
  }
}
