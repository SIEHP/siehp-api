import { HttpException, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

export class ValidationException extends HttpException {
  constructor(error: ZodError) {
    const errorMessage = error.errors
      .map((error) => {
        const fieldPath = error.path.join('.');
        return `Campo "${fieldPath}" ${error.message}`;
      })
      .join('\n');

    super(errorMessage, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
