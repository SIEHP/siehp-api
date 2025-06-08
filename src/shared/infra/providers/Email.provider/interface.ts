import { Transporter } from 'nodemailer';
import { SendDTO } from './dto';

export interface EmailProviderInterface {
  send(data: SendDTO): Promise<void>;
}
