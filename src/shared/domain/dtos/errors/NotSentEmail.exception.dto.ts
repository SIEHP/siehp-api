export interface NotSentEmailExceptionDTO {
  subject: string;
  to: string;
  error: Error;
}
