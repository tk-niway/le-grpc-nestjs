import { Module } from '@nestjs/common';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReflectionService } from '@grpc/reflection';
import {
  InterceptingCall,
} from '@grpc/grpc-js';
import { ItemsController } from './items/items.controller';

// gRPC interceptorはクライアントのみで利用可能
function interceptor(options: any, nextCall: any) {
  console.log('Intercepting call');
  const interceptingCall = new InterceptingCall(nextCall(options), {
    start: function (metadata, _listener, next) {
      const response: any = {};

      const listener = {
        onReceiveMetadata: (metadata: any, next: any) => {
          console.log('Received metadata:', metadata);
          response.metadata = metadata;
          next(metadata);
        },
        onReceiveMessage: (message: any, next: any) => {
          console.log('Received message:', message);
          response.message = message;
          next(response);
        },
        onReceiveStatus: (status: any, next: any) => {
          console.log('Received status:', status);
          const { code, details } = status;
          response.status = { code, details };
          next(status);
        },
      };

      next(metadata, listener);
    },
  });
  return interceptingCall;
}
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
          channelOptions: {
            interceptors: [interceptor],
          },
          onLoadPackageDefinition: (pkg, server) => {
            new ReflectionService(pkg).addToServer(server);
          },
        },
      },
    ]),
  ],
  controllers: [AppController, ItemsController],
  providers: [AppService],
})
export class AppModule {}
