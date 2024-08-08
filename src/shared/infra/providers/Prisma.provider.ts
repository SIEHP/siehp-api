import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Enviroment, appConfig } from '../../config/app';

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

  async seed(seeders: ((prisma: PrismaClient) => Promise<void>)[]) {
    if (this.enviroment === Enviroment.PRODUCTION) {
      throw new Error('This method is not allowed in production enviroment');
    }

    for (const seeder of seeders) {
      await seeder(this);
    }
  }

  async clear(models: string[] | 'all') {
    if (this.enviroment === Enviroment.PRODUCTION) {
      throw new Error('This method is not allowed in production enviroment');
    }

    const allModels = [
      'user_permissions',
      'users',
      'included_permissions',
      'permissions',
    ];

    const modelsToClear = models === 'all' ? allModels : models;

    for (const model of modelsToClear) {
      await this.$queryRawUnsafe(
        `TRUNCATE TABLE "${model}" RESTART IDENTITY CASCADE;`,
      );
    }
  }
}
