import { TransactionType } from '../point/point.model';
import { PointRepository } from './point.repository';
import { Injectable } from '@nestjs/common';
import { PointHistory, UserPoint } from './point.model';

@Injectable()
export class PointService {
  constructor(private readonly pointRepository: PointRepository) {}

  async getPointById(id: number): Promise<UserPoint> {
    //TODO - Custom Error Implements
    return await this.pointRepository.getPointById(id);
  }

  //특정 유저의 포인트 충전/이용 내역을 조회하는 기능
  async history(id: number): Promise<PointHistory[]> {
    return await this.pointRepository.getHistoryId(id);
  }

  //특정 유저의 포인트를 충전하는 기능
  async charge(id: number, amount: number): Promise<UserPoint> {
    //TODO - Custom Error
    //TODO - 동시성 제어: 동시성 제어란 공유자원을 두고 타투는 싸움!

    const transactionType = TransactionType.CHARGE;
    const userPoint = await this.pointRepository.upsertPoint(id, amount);
    await this.pointRepository.setHisotryId(
      id,
      amount,
      transactionType,
      userPoint.updateMillis,
    );

    return userPoint;
  }

  //특정 유저의 포인트를 사용하는 기능
  async use(id: number, amount: number): Promise<UserPoint> {
    const transactionType: TransactionType = TransactionType.USE;
    const userPoint = await this.pointRepository.getPointById(id);
    const point = userPoint.point;

    if (point < amount) throw new Error(`${amount - point}point 부족`);

    //TODO - Custom Error & 포인트가 충분하지 않은
    //TODO - 동시성 제어: 동시성 제어란 공유자원을 두고 타투는 싸움!

    const useUserPoint = await this.pointRepository.upsertPoint(id, amount);
    await this.pointRepository.setHisotryId(
      id,
      amount,
      transactionType,
      useUserPoint.updateMillis,
    );
    return useUserPoint;
  }
}
