import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('gateway http://localhost:8000');
  await app.listen(8000);
}
bootstrap();
