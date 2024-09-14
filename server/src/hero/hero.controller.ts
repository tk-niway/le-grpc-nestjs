import { Controller } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { Hero, HeroById, HeroServiceControllerMethods } from 'src/proto/hero';

@HeroServiceControllerMethods()
@Controller('hero')
export class HeroController {
  private readonly items: Hero[] = [
    { id: 1, name: 'chris' },
    { id: 2, name: 'michel' },
  ];

  unaryCall(data: HeroById): Hero {
    console.log('HeroService.UnaryCall received %o', data);

    const item = this.items.find(({ id }) => id === data.id);

    console.log('HeroService.UnaryCall responses %o', item);

    return item;
  }

  clientStreamAsObservable(data$: Observable<HeroById>): Observable<Hero> {
    const hero$ = new Subject<Hero>();

    let names: any[] = [];
    const onNext = (heroById: HeroById) => {
      console.log('HeroService.ClientStreamAsObservable received %o', heroById);

      const item = this.items.find(({ id }) => id === heroById.id);

      if (item) {
        console.log('HeroService.ClientStreamAsObservable responses %o', item);
        names.push(item.name);
        console.log('names', names);
        hero$.next(item);
      } else {
        console.log(
          'HeroService.ClientStreamAsObservable no item found for %o',
          heroById,
        );
      }
    };

    const onComplete = () => {
      hero$.complete();
      console.log('HeroService.ClientStreamAsObservable completed');
    };

    data$.subscribe({
      next: onNext,
      error: (err) => {
        console.error('HeroService.ClientStreamAsObservable error %o', err);
        hero$.error(err);
      },
      complete: onComplete,
    });

    return hero$.asObservable();
  }

  serverStreamAsObservable(data: HeroById): Observable<Hero> {
    const subject = new Subject<Hero>();
    console.log('HeroService.ServerStreamAsObservable received %o', data);

    const onNext = (item: Hero) => {
      console.log('HeroService.ServerStreamAsObservable responses %o', item);
    };

    const onComplete = (): void => {
      console.log('HeroService.ServerStreamAsObservable completed');
    };

    subject.subscribe({
      next: onNext,
      error: null,
      complete: onComplete,
    });

    let i = 0;
    setInterval(() => {
      if (i >= this.items.length) {
        subject.complete();
      } else {
        const item = this.items[i];
        subject.next(item);
        i += 1;
      }
    }, 1000);

    return subject.asObservable();
  }

  bidirectionalStreamAsObservable(
    data$: Observable<HeroById>,
  ): Observable<Hero> {
    const hero$ = new Subject<Hero>();

    const onNext = (heroById: HeroById) => {
      console.log(
        'HeroService.BidirectionalStreamAsObservable received %o',
        heroById,
      );

      const item = this.items.find(({ id }) => id === heroById.id);

      console.log(
        'HeroService.BidirectionalStreamAsObservable responses %o',
        item,
      );

      hero$.next(item);

      if (heroById.id === 1) {
        hero$.next({ id: 4, name: 'chris2' });
      }
    };

    const onComplete = (): void => {
      console.log('HeroService.BidirectionalStreamAsObservable completed');
      hero$.complete();
    };

    data$.subscribe({
      next: onNext,
      error: null,
      complete: onComplete,
    });

    return hero$.asObservable();
  }
}
