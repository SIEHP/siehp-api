import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyUsedTokenException extends HttpException {
  constructor() {
    super('Esse token já foi utilizado.', HttpStatus.BAD_REQUEST);
  }
}
