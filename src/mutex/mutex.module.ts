import { Module } from '@nestjs/common';
import { Mutex } from './mutex';

@Module({
  providers: [Mutex], // Mutex를 provider로 등록
  exports: [Mutex], // 다른 모듈에서 사용할 수 있도록 export
})
export class MutexModule {}
