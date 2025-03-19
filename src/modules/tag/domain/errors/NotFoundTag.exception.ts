import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundTagException extends HttpException {
    constructor() {
        super('Tag não encontrada.', HttpStatus.NOT_FOUND);
    }
} 