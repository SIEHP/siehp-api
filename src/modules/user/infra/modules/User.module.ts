import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes();
  }
}
