import { LoggerService, Injectable, Logger } from '@nestjs/common';
import { DiscordWebhookProvider } from './DiscordWebhook.provider';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';

@Injectable()
export class LoggerProvider implements LoggerService {
  private logger = new Logger();

  constructor(
    private readonly discordWebhookProvider: DiscordWebhookProvider,
  ) {}
  /**
   * Write a 'log' level log.
   */
  async log(message: any) {
    await this.discordWebhookProvider.log(message);
  }

  /**
   * Write an 'error' level log.
   */
  async error(data: AllExceptionsFilterDTO) {
    await this.discordWebhookProvider.error(data);
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    this.logger.fatal(message);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message);
  }
}
