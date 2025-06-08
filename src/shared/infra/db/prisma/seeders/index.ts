import 'dotenv/config';
import { appConfig } from '../../../../config/app';
import { PrismaProvider } from '../../../providers/Prisma.provider';
import { userSeeder } from '../../../../../modules/user/infra/db/prisma/seeders/user';

const prisma = new PrismaProvider();

if (appConfig.NODE_ENV !== 'production') {
  prisma.seed([userSeeder]);
}
