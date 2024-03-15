import { Module, NestModule } from '@nestjs/common';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';

@Module({
  imports: [SharedModule],
})
export class AppModule implements NestModule {
  configure() {}
}
