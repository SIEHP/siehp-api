import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor() {
    super('Acesso não autorizado.', HttpStatus.UNAUTHORIZED);
  }
}
