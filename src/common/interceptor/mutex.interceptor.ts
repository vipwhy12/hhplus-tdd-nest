import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Mutex } from '../../mutex/mutex';
import { finalize } from 'rxjs/operators';

@Injectable()
export class MutexInterceptor implements NestInterceptor {
  constructor(readonly mutex: Mutex) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    console.time('요청을 시도합니다. lock을 생성합니다.!');
    // 잠금
    await this.mutex.lock();

    return next.handle().pipe(
      finalize(() => {
        console.timeEnd('요청을 시도합니다. lock을 생성합니다.!');

        // 처리 후 잠금 해제
        this.mutex.release();
      }),
    );
  }
}
