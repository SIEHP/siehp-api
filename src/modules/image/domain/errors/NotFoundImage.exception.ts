import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundImageException extends Error {
    constructor() {
        super('Image not found');
        this.name = 'NotFoundImageException';
    }
} 