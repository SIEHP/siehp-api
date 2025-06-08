import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { createTransport, Transporter } from 'nodemailer';
import { emailConfig } from 'src/shared/config/email';
import {
  ParseTemplateDTO,
  SendDTO,
} from 'src/shared/infra/providers/Email.provider/dto';
import { NotSentEmailException } from 'src/shared/infra/exceptions/NotSentEmail.exception';
import { EmailProviderInterface } from 'src/shared/infra/providers/Email.provider/interface';
import { LoggerProvider } from '../Logger.provider';
import { appConfig, Enviroment } from 'src/shared/config/app';

@Injectable()
export class EmailProvider implements EmailProviderInterface {
  private client: Transporter;

  constructor(private readonly loggerProvider: LoggerProvider) {}

  public async send({ subject, templateData, to }: SendDTO): Promise<void> {
    const html = this.parse(templateData);

    try {
      this.client = createTransport(
        {
          ...emailConfig.transport,
        },
        {
          from: {
            address: emailConfig.defaults.from.address,
            name: emailConfig.defaults.from.name,
          },
        },
      );

      await this.client.sendMail({
        from: {
          address: emailConfig.defaults.from.address,
          name: emailConfig.defaults.from.name,
        },
        to,
        subject,
        html,
      });
    } catch (error) {
      await this.loggerProvider.log(
        `to: ${to} \nsubject: ${subject} \nhtml: ${html}`,
      );

      if (appConfig.NODE_ENV === Enviroment.PRODUCTION) {
        throw new NotSentEmailException();
      }
    }
  }

  private parse({ filePath, variables }: ParseTemplateDTO) {
    const templateFileContent = readFileSync(filePath, 'utf-8');

    const parseTemplate = Handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
