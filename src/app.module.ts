import { ClasseController } from './modules/classes/controllers/classe.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [
        ClasseController, AppController],
  providers: [AppService],
})
export class AppModule {}
