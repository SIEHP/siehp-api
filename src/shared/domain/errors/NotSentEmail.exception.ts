import { NotSentEmailExceptionDTO } from '../dtos/errors/NotSentEmail.exception.dto';

export class NotSentEmailException extends Error {
  constructor({ error, subject, to }: NotSentEmailExceptionDTO) {
    const errorMessage = `Erro ao enviar email \n Não foi possível enviar o email: ${subject} para: ${to} \n Erro: ${error.message}`;
    super(errorMessage);
  }
}
