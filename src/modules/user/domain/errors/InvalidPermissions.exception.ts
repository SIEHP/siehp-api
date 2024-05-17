import { HttpException, HttpStatus } from '@nestjs/common';
import { InvalidPermissionsExceptionDTO } from '../dtos/errors/InvalidPermissions.exception.dto';

export class InvalidPermissionsException extends HttpException {
  constructor({ permissions }: InvalidPermissionsExceptionDTO) {
    const permissionsString = permissions
      .map((permission) => permission.replace('_', ' '))
      .join(', ');

    super(
      `Você precisa das permissões ${permissionsString} para utilizar esse recurso.`,
      HttpStatus.FORBIDDEN,
    );
  }
}
