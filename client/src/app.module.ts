import { Module } from '@nestjs/common';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReflectionService } from '@grpc/reflection';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SAMPLE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:5000',
          package: ['sample', 'hero'],
          protoPath: [
            join(__dirname, 'proto/sample.proto'),
            join(__dirname, 'proto/hero.proto'),
          ],
          onLoadPackageDefinition: (pkg, server) => {
            new ReflectionService(pkg).addToServer(server);
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
