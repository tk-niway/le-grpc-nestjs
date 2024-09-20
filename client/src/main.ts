import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3000,
      },
    },
  );

  await app.listen();
  
  // for standalone app
  // app.useGlobalPipes(new ValidationPipe());
  // console.log('client http://localhost:3000');
  // await app.listen(3000);
}
bootstrap();
