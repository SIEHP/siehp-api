import { AllExceptionsFilterDTO } from '../dtos/errors/AllException.filter.dto';

export interface DiscordWebhookProviderInterface {
  error(data: AllExceptionsFilterDTO): Promise<void>;
  log(message: string): Promise<void>;
}
