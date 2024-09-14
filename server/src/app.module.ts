import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HeroController } from './hero/hero.controller';
import { HeroModule } from './hero/hero.module';

@Module({
  controllers: [AppController, HeroController],
  imports: [HeroModule],
})
export class AppModule {}
