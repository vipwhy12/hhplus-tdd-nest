import { Injectable } from '@nestjs/common';
import { UserPoint } from './point.model';

@Injectable()
export class PointService {
  constructor() {}

  //TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
  async point(id: number): Promise<UserPoint> {
    return { id: id, point: 0, updateMillis: Date.now() };
  }
}
