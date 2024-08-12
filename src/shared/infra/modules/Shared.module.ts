import { Global, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { PrismaProvider } from '../providers/Prisma.provider';
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
  controllers: [],
  providers: [
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
    {
      provide: PrismaProvider,
      useValue: new PrismaProvider(),
    },
  ],
})
export class SharedModule implements NestModule {
  configure() {}
}
