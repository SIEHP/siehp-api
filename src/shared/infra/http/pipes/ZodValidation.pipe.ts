import { PipeTransform, ArgumentMetadata, HttpException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors
          .map((error) => `${error.path} ${error.message}`)
          .join('\n');
        throw new HttpException(errorMessage, 422);
      }
    }
  }
}
