import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { createTransport, Transporter } from 'nodemailer';
import { emailConfig } from 'src/shared/config/email';
import {
  ParseTemplateDTO,
  SendDTO,
  ServiceDTO,
} from 'src/shared/domain/dtos/providers/Email.provider.dto';
import { NotSentEmailException } from 'src/shared/domain/errors/NotSentEmail.exception';
import { EmailProviderInterface } from 'src/shared/domain/providers/Email.provider';

@Injectable()
export class EmailProvider implements EmailProviderInterface {
  client: Transporter;

  constructor() {}

  public async send({ subject, templateData, to }: SendDTO): Promise<boolean> {
    return true;
  }

  private parse({ file, variables }: ParseTemplateDTO) {
    const templateFileContent = readFileSync(file, 'utf-8');

    const parseTemplate = Handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }

  private async sendEmailToService(
    { host, password, port, username }: ServiceDTO,
    { to, subject, templateData }: SendDTO,
  ): Promise<boolean> {
    const html = this.parse(templateData);

    try {
      this.client = createTransport(
        {
          host: host,
          port: port,
          auth: {
            user: username,
            pass: password,
          },
        },
        {
          from: {
            address: emailConfig.from,
            name: emailConfig.name,
          },
        },
      );

      await this.client.sendMail({
        from: {
          name: emailConfig.name,
          address: emailConfig.from,
        },
        to,
        subject,
        html,
      });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          new NotSentEmailException({
            error,
            subject,
            to,
          }).message,
        );
      }
    }
  }
}
