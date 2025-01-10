import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TokenProviderInterface } from 'src/modules/user/domain/providers/Token.provider';
import { UserRepository } from '../db/repositories/User.repository';
import { SendTokenDTO } from 'src/modules/user/domain/dtos/services/Token.Service.dto';
import { EmailProvider } from '../../../../shared/infra/providers/Email.provider';
import { PrismaProvider } from '../../../../shared/infra/providers/Prisma.provider';
import { join } from 'path';
import { addDays, addHours } from 'date-fns';

@Injectable()
export class TokenProvider implements TokenProviderInterface {
  constructor(
    private readonly emailProvider: EmailProvider,
    private readonly prisma: PrismaProvider,
    private readonly userRepository: UserRepository,
  ) {}

  generateToken(): string {
    return uuidv4();
  }

  async validateToken(storedToken: string, providedToken: string): Promise<boolean> {
    const token = await this.prisma.token.findUnique({
      where: {
        token: providedToken,
      },
      include: {
        user: true,
      }
    });

    if (!token) {
      return false;
    }

    if (token.expires_at < new Date()) {
      return false;
    }

    return token.token === storedToken;
  }

  async getTokenData(token: string) {
    return await this.prisma.token.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      }
    });
  }

  async invalidateToken(token: string) {
    await this.prisma.token.update({
      where: {
        token,
      },
      data: {
        is_used : true,
      }
    });
  }

  async sendToken(data: SendTokenDTO): Promise<void> {
    const token = this.generateToken();
    const expires_at = addDays(new Date(), 7); 

    // Criar ou atualizar token no banco
    await this.prisma.token.create({
      data: {
        token,
        user_id: data.userId,
        expires_at,
      },
    });

    const templatePath = join(
      process.cwd(),
      'src/modules/user/infra/views/emails/invite.hbs',
    );

    await this.emailProvider.send({
      subject: 'Convite para Cadastro - SIEHP',
      to: data.email,
      templateData: {
        filePath: templatePath,
        variables: {
          userName: data.email,
          token: token,
          link: `${process.env.FRONTEND_URL}/cadastro?token=${token}`,
        },
      },
    });
  }
}
