import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { discordConfig } from 'src/shared/config/discord';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter';
import { DiscordWebhookProviderInterface } from 'src/shared/domain/providers/DiscordWebhook.provider';
import { getTimestampIcon } from '../utils/functions';
import { appConfig } from 'src/shared/config/app';

@Injectable()
export class DiscordWebhookProvider implements DiscordWebhookProviderInterface {
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

    if (
      !discordConfig.ERROR_WEBHOOK_URL ||
      appConfig.NODE_ENV === 'development'
    ) {
      console.log(content);
      return;
    }

    await axios.post(discordConfig.ERROR_WEBHOOK_URL, {
      content,
    });
  }

  async log(message: string): Promise<void> {
    if (
      !discordConfig.LOG_WEBHOOK_URL ||
      appConfig.NODE_ENV === 'development'
    ) {
      console.log(message);
      return;
    }

    await axios.post(discordConfig.LOG_WEBHOOK_URL, {
      content: message,
    });
  }
}
