import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from '../http/controllers/User.controller';
import { LoginUseCase } from '../usecases/Login.usecase';
import { UserRepository } from '../db/repositories/User.repository';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';

@Module({
  controllers: [UserController],
  providers: [
    PrismaProvider,
    {
      provide: PrismaProvider,
      useValue: new PrismaProvider(),
    },
    LoginUseCase,
    UserRepository,
  ],
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '7d' },
    }),
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes();
  }
}
