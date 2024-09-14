import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import {
  AppServiceController,
  SampleData,
  SampleDataById,
} from './proto/sample';
import { Observable, Subject } from 'rxjs';

@Controller()
export class AppController implements AppServiceController {
  items = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ] as SampleData[];

  @GrpcMethod('AppService')
  findOne(data: SampleDataById): SampleData {
    const filteredItems = this.items.filter((item) => item.id === data.id);

    return filteredItems.length > 0 ? filteredItems[0] : ({} as SampleData);
  }

  @GrpcStreamMethod('AppService')
  findMany(data: Observable<SampleDataById>): Observable<SampleData> {
    const subject = new Subject<SampleData>();

    const onNext = (sampleDataById: SampleDataById) => {
      const item = this.items.find(({ id }) => id === sampleDataById.id);
      subject.next(item);
    };

    const onComplete = () => subject.complete();

    data.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }
}
