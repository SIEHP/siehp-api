import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundImageException extends HttpException {
    constructor() {
        super('Imagem não encontrada.', HttpStatus.NOT_FOUND);
    }
} 