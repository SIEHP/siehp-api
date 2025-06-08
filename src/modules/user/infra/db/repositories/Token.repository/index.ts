import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { FindTokenDTO } from './dto';
import { TokenRepositoryInterface } from 'src/modules/user/infra/db/repositories/Token.repository/interface';

@Injectable()
export class TokenRepository implements TokenRepositoryInterface {
  constructor(private readonly prisma: PrismaProvider) {}

  async findToken({ token }: FindTokenDTO) {
    return await this.prisma.token.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
  }
}
