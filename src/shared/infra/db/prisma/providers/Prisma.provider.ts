import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Enviroment, appConfig } from '../../../../config/app';
import { exampleSeeder } from '../seeders/example';

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

    await Promise.all([exampleSeeder(this)]);
  }

  async clear() {
    if (this.enviroment === Enviroment.PRODUCTION) {
      throw new Error('This method is not allowed in production enviroment');
    }

    await this.$queryRawUnsafe(
      'TRUNCATE TABLE "Example" RESTART IDENTITY CASCADE;',
    );
  }
}
