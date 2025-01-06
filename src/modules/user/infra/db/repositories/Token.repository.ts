import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { TokenRepositoryInterface } from '../../../domain/repositories/Token.repository';
import { FindTokenDTO } from '../../../domain/dtos/repositories/Token.repository.dto';

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