import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ExampleController } from '../http/controllers/Example/Example.controller';
import { ExampleRepository } from '../db/repositories/Example.repository';
import { GetExampleUseCase } from '../usecases/GetExample.usecase';
import { ExampleMiddleware } from '../http/middlewares/Example.middleware';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { PrismaProvider } from '../providers/Prisma.provider';
import { CheckUserPermissionsUseCase } from 'src/modules/user/infra/usecases/CheckUserPermissions.usecase';
import { PermissionRepository } from 'src/modules/user/infra/db/repositories/Permission.repository';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '7d' },
      global: true,
    }),
  ],
  controllers: [ExampleController], // TODO: Remove these examples after fully implemented
  providers: [
    ExampleRepository,
    CheckUserPermissionsUseCase,
    PermissionRepository,
    GetExampleUseCase,
    PrismaProvider,
    {
      provide: PrismaProvider,
      useValue: new PrismaProvider(),
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  exports: [
    ExampleRepository,
    GetExampleUseCase,
    {
      provide: PrismaProvider,
      useValue: new PrismaProvider(),
    },
  ],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // TODO: Remove this middleware after fully implemented
    consumer.apply(ExampleMiddleware).forRoutes({
      path: 'example',
      method: RequestMethod.GET,
    });
  }
}
