import { PointRepository } from './point.repository';
import { Injectable } from '@nestjs/common';
import { PointHistory, UserPoint } from './point.model';

@Injectable()
export class PointService {
  constructor(private readonly pointRepository: PointRepository) {}

  getPointById(id: number): Promise<UserPoint> {
    return this.pointRepository.getPointById(id);
  }

  //특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
  history(id: number): Promise<PointHistory[]> {
    return this.pointRepository.getHistoryId(id);
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
