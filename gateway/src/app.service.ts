import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('CLIENT_SERVICE') private readonly client: ClientProxy,
    @Inject('SERVER_SERVICE') private readonly server: ClientProxy,
  ) {}

  getClient() {
    console.log('gateway : getClient');
    this.client.emit('getClient', 'variable test');
    return 'success emit';
  }

  getClientMessage() {
    console.log('gateway : getClientMessage');
    const result = this.client.send(
      { cmd: 'getClientMessage' },
      'variable test message',
    );
    return result;
  }

  saveFile() {
    console.log('gateway : saveFile');
    const result = this.client.send({ cmd: 'saveFile' }, '');
    return result;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
