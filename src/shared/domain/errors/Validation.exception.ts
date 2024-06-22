import { HttpException, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

export class ValidationException extends HttpException {
  constructor(error: ZodError) {
    const errorMessage = error.errors
      .map((error) => `${error.message}`)
      .join('\n');

    super(errorMessage, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
