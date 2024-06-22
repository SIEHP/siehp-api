import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Enviroment, appConfig } from '../../config/app';
import { userSeeder } from '../db/prisma/seeders/user';

@Injectable()
export class PrismaProvider
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private enviroment: Enviroment = appConfig.NODE_ENV) {
    let datasourceUrl = appConfig.DATABASE_URL;
    if (enviroment === Enviroment.TEST) {
      datasourceUrl = appConfig.SHADOW_DATABASE_URL;
    }
    super({
      datasourceUrl,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async seed() {
    if (this.enviroment === Enviroment.PRODUCTION) {
      throw new Error('This method is not allowed in production enviroment');
    }

    await Promise.all([userSeeder(this)]);
  }

  async clear() {
    if (this.enviroment === Enviroment.PRODUCTION) {
      throw new Error('This method is not allowed in production enviroment');
    }

    await this.$queryRawUnsafe(
      'TRUNCATE TABLE "user_permissions" RESTART IDENTITY CASCADE;',
    );

    await this.$queryRawUnsafe(
      'TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;',
    );

    await this.$queryRawUnsafe(
      'TRUNCATE TABLE "included_permissions" RESTART IDENTITY CASCADE;',
    );

    await this.$queryRawUnsafe(
      'TRUNCATE TABLE "permissions" RESTART IDENTITY CASCADE;',
    );
  }
}
