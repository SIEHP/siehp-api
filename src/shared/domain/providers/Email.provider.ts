import { Transporter } from 'nodemailer';
import { SendDTO } from '../dtos/providers/Email.provider.dto';

export interface EmailProviderInterface {
  send(data: SendDTO): Promise<void>;
}
