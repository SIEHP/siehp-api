import 'dotenv/config';
import { appConfig } from '../../../../config/app';
import { PrismaProvider } from '../../../providers/Prisma.provider';

const prisma = new PrismaProvider();

if (appConfig.NODE_ENV !== 'production') {
  prisma.seed();
}
