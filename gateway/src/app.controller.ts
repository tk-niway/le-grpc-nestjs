import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('client')
  getClient() {
    return this.appService.getClient();
  }

  @Get('client-message')
  getClientMessage() {
    return this.appService.getClientMessage();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
