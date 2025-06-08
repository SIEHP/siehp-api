import { Module, NestModule } from '@nestjs/common';
import { UserModule } from 'src/modules/user/infra/modules/User.module';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';

@Module({
  imports: [SharedModule, UserModule],
})
export class AppModule implements NestModule {
  configure() {}
}
