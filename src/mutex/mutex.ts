import { Injectable } from '@nestjs/common';
import { LinkedList } from './linkedList';

@Injectable()
export class Mutex {
  private userMap: Map<number, LinkedList> = new Map();

  async isExistLock<T>(id: number, fun: () => Promise<T>): Promise<T> {
    if (!this.userMap.has(id)) {
      this.userMap.set(id, new LinkedList(fun));
      return await this.executeTask(id, fun);
    }

    const taskQueue = this.userMap.get(id);

    return new Promise<T>((resolve, reject) => {
      const taskWrapper = async () => {
        try {
          const result = await fun();
          resolve(result); // 결과 반환
          return result;
        } catch (error) {
          console.log(error);
          reject(error); // 에러 발생 시 reject
        }
      };
      taskQueue.addNode(taskWrapper); // 대기열에 추가할 때 래핑된 함수를 추가
    });
  }

  private async executeTask<T>(id: number, task: () => Promise<T>): Promise<T> {
    try {
      return await task(); // 작업 실행
    } finally {
      await this.release(id); // 작업이 완료되면 락 해제
    }
  }

  // 락 해제
  async release(id: number): Promise<void> {
    const userLock = this.userMap.get(id);
    userLock.popNode();

    // 대기열에 남은 작업이 있으면 다음 작업을 실행
    if (userLock.headNode) {
      const nextTask = userLock.headNode.data;
      await this.executeTask(id, nextTask);
    }
  }
}
