import { Injectable } from '@nestjs/common';

@Injectable()
export class Mutex {
  waiters: any[] = [];
  locked: boolean = false;

  async lock(): Promise<void> {
    if (this.locked) {
      return new Promise((resolve) => {
        this.waiters.push(resolve); // 대기열에 대기자 추가
        console.log(this.waiters);
      });
    }

    //잠금!
    this.locked = true;
  }

  async release() {
    if (this.waiters.length > 0) {
      const next = await this.waiters.shift();
      next();
    } else {
      this.locked = false;
    }
  }
}
