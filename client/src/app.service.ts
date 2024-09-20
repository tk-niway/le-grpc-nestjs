import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  catchError,
  EMPTY,
  Observable,
  ReplaySubject,
  tap,
  toArray,
} from 'rxjs';
import { AppServiceClient, SampleData, SampleDataById } from './proto/sample';
import {
  FileChunk,
  FileResponse,
  Hero,
  HeroById,
  HeroServiceClient,
} from './proto/hero';
import * as fs from 'fs';

@Injectable()
export class AppService implements OnModuleInit {
  private sampleService: AppServiceClient;
  private heroService: HeroServiceClient;

  constructor(@Inject('SAMPLE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.sampleService = this.client.getService<AppServiceClient>('AppService');

    this.heroService = this.client.getService<HeroServiceClient>('HeroService');
  }

  getSampleDataById(id: string): Observable<SampleData> {
    return this.sampleService.findOne({ id: Number(id) } as SampleDataById);
  }

  getManySampleData(): Observable<SampleData[]> {
    const ids = new ReplaySubject<SampleDataById>();
    ids.next({ id: 1 });
    ids.next({ id: 2 });
    ids.complete();

    const stream = this.sampleService.findMany(ids.asObservable());

    return stream.pipe(toArray());
  }

  getHeroDataById(id: string): Observable<Hero> {
    return this.heroService.unaryCall({ id: Number(id) });
  }

  // clientStream(): Observable<Hero> {
  //   const ids = new ReplaySubject<{ id: number }>();
  //   ids.next({ id: 1 });
  //   ids.next({ id: 2 });
  //   ids.complete();

  //   const stream = this.heroService.clientStreamAsObservable(
  //     ids.asObservable(),
  //   );

  //   stream.forEach((hero) => {
  //     console.log('clientStream', hero);
  //   });

  //   return stream;
  // }

  clientStream(): Observable<Hero> {
    const ids = new ReplaySubject<HeroById>();
    ids.next({ id: 1 });
    ids.next({ id: 2 });
    ids.complete();

    const stream = this.heroService.clientStreamAsObservable(
      ids.asObservable(),
    );

    stream
      .pipe(
        tap((hero) => console.log('gRPCクライアントストリーム受信:', hero)),
        catchError((error) => {
          console.error('gRPCクライアントストリームエラー:', error);
          return EMPTY;
        }),
      )
      .subscribe();

    return stream;
  }

  serverStream(): Observable<Hero> {
    const stream = this.heroService.serverStreamAsObservable({ id: 1 });

    let names: string[] = [];
    stream.forEach((hero) => {
      console.log('serverStream', hero.name);
      names.push(hero.name);
      console.log('names', names);
    });

    return stream;
  }

  bidirectionalStream(): Observable<Hero> {
    const ids = new ReplaySubject<{ id: number }>();
    ids.next({ id: 1 });
    // ids.complete();

    const stream = this.heroService.bidirectionalStreamAsObservable(
      ids.asObservable(),
    );

    stream
      .pipe(
        tap((hero) => {
          console.log('gRPCクライアントストリーム受信:', hero);

          if (hero.id === 4) {
            console.log('hero.id === 4');
            ids.next({ id: 2 });
          }

          if (hero.id === 2) {
            console.log('hero.id === 2');
            ids.complete();
          }
        }),
        catchError((error) => {
          console.error('gRPCクライアントストリームエラー:', error);
          return EMPTY;
        }),
      )
      .subscribe();

    return stream;
  }

  saveFile(): Observable<FileResponse> {
    console.log('saveFile client:  reading file');
    const fileStream = fs.createReadStream('../package-lock.json');

    const fileChunk$ = new Observable<FileChunk>((observer) => {
      fileStream.on('data', (chunk) => {
        observer.next({
          data:
            chunk instanceof Buffer
              ? new Uint8Array(chunk)
              : new TextEncoder().encode(chunk),
        });
      });
      fileStream.on('end', () => {
        observer.complete();
      });
      fileStream.on('error', (err) => {
        observer.error(err);
      });
    });

    return this.heroService.saveFile(fileChunk$);
  }
}
