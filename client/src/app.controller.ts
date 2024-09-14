import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { SampleData } from './proto/sample';
import { Hero } from './proto/hero';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hero/server-stream')
  serverStream(): Observable<Hero> {
    console.log('serverStream');
    return this.appService.serverStream();
  }

  @Get('hero/client-stream')
  clientStream(): Observable<Hero> {
    console.log('clientStream');
    return this.appService.clientStream();
  }

  @Get('hero/bidi-stream')
  bidirectionalStream(): Observable<Hero> {
    console.log('bidirectionalStream');
    return this.appService.bidirectionalStream();
  }

  @Get()
  getMany(): Observable<SampleData[]> {
    const stream = this.appService.getManySampleData();

    return stream;
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<SampleData> {
    console.log('getById', id);
    return this.appService.getSampleDataById(id);
  }

  @Get('hero/:id')
  getHeroById(@Param('id') id: string): Observable<Hero> {
    return this.appService.getHeroDataById(id);
  }
}
