import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyInUseExpection extends HttpException {
  constructor() {
    super('E-mail já está em uso.', HttpStatus.CONFLICT);
  }
}
