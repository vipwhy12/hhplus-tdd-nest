import { Injectable } from '@nestjs/common';
import { PointHistory, UserPoint } from './point.model';
import { UserPointTable } from 'src/database/userpoint.table';
import { PointHistoryTable } from 'src/database/pointhistory.table';

@Injectable()
export class PointService {
  constructor() {} // private readonly historyDb: PointHistoryTable, // private readonly userDb: UserPointTable,

  //TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
  async point(id: number): Promise<UserPoint> {
    return { id: id, point: 0, updateMillis: Date.now() };
  }

  //TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
  async history(id: number): Promise<PointHistory[]> {
    console.log(id);
    return [];
  }

  //TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
  async charge(id: number, amount: number): Promise<UserPoint> {
    return { id, point: amount, updateMillis: Date.now() };
  }

  //TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
  async use(id: number, amount: number): Promise<UserPoint> {
    return { id, point: amount, updateMillis: Date.now() };
  }
}
