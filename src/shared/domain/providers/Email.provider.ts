import { Transporter } from 'nodemailer';
import {
  ParseTemplateDTO,
  SendDTO,
} from '../dtos/providers/Email.provider.dto';

export interface EmailProviderInterface {
  client: Transporter;
  send(data: SendDTO): Promise<boolean>;
}
