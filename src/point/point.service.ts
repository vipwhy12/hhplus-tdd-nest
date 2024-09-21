import { Injectable } from '@nestjs/common';
import { PointHistory, UserPoint } from './point.model';

@Injectable()
export class PointService {
  constructor() {}

  //TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
  async point(id: number): Promise<UserPoint> {
    return { id: id, point: 0, updateMillis: Date.now() };
  }

  //TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
  async history(id: number): Promise<PointHistory[]> {
    console.log(id);
    return [];
  }
}
