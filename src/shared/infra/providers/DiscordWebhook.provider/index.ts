import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { discordConfig } from 'src/shared/config/discord';
import { AllExceptionsFilterDTO } from 'src/shared/infra/filters/AllException.filter/dto';
import { DiscordWebhookProviderInterface } from 'src/shared/infra/providers/DiscordWebhook.provider/interface';
import { getTimestampIcon } from '../../utils/functions';
import { Enviroment, appConfig } from 'src/shared/config/app';

@Injectable()
export class DiscordWebhookProvider implements DiscordWebhookProviderInterface {
  constructor(private enviroment: Enviroment = appConfig.NODE_ENV) {}

  async error({
    message,
    path,
    statusCode,
    timestamp,
  }: AllExceptionsFilterDTO): Promise<void> {
    const date = new Date(timestamp);
    date.setHours(date.getHours() - 3);

    const timeStampIcon = getTimestampIcon(date);

    const timestampText = date.toLocaleString('pt-BR');

    const content = `🛑 **Error**: ${message}\n⛵ **Path**: ${path}\n💻 **StatusCode**: ${statusCode}\n${timeStampIcon} **Timestamp**: ${timestampText}\n\n‎`;

    if (this.enviroment === Enviroment.TEST) {
      return;
    }

    if (!discordConfig.ERROR_WEBHOOK_URL) {
      console.log(content);
      return;
    }

    await axios.post(discordConfig.ERROR_WEBHOOK_URL, {
      content,
    });
  }

  async log(message: string): Promise<void> {
    if (this.enviroment === Enviroment.TEST) {
      return;
    }

    if (!discordConfig.LOG_WEBHOOK_URL) {
      console.log(message);
      return;
    }

    await axios.post(discordConfig.LOG_WEBHOOK_URL, {
      content: message,
    });
  }
}
