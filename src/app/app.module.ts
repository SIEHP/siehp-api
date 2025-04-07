import { Module, NestModule } from '@nestjs/common';
import { UserModule } from 'src/modules/user/infra/modules/User.module';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';
import { ImageModule } from 'src/modules/image/infra/modules/Image.module';
import { TagModule } from 'src/modules/tag/infra/modules/Tag.module';

@Module({
  imports: [SharedModule, UserModule, ImageModule, TagModule],
})
export class AppModule implements NestModule {
  configure() {}
}
