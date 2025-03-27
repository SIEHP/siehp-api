import { Module, NestModule } from '@nestjs/common';
import { UserModule } from 'src/modules/user/infra/modules/User.module';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';
import { ImageModule } from 'src/modules/image/infra/modules/Image.module';

@Module({
  imports: [SharedModule, UserModule, ImageModule],
})
export class AppModule implements NestModule {
  configure() {}
}
