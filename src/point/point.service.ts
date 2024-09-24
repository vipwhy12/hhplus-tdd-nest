import { TransactionType } from 'src/point/point.model';
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

  //특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
  async history(id: number): Promise<PointHistory[]> {
    return await this.pointRepository.getHistoryId(id);
  }

  //특정 유저의 포인트를 충전하는 기능을 작성해주세요.
  async charge(id: number, amount: number): Promise<UserPoint> {
    //TODO - Custom Error
    //TODO - 동시성 제어: 동시성 제어란 공유자원을 두고 타투는 싸움!
    /** 행동분석
     * 1. 유저의 point를 충전한다.
     * 2. 유저의 history를 생성한다.
     * 3. 결과를 반환한다.
     */

    const transactionType: TransactionType = TransactionType.CHARGE;
    const userPoint: UserPoint = await this.pointRepository.charge(id, amount);
    const userHistory = await this.pointRepository.setHisotryId(
      id,
      amount,
      transactionType,
      userPoint.updateMillis,
    );

    return userPoint;
  }

  //TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
  async use(id: number, amount: number): Promise<UserPoint> {
    //TODO - Custom Error
    //TODO - 동시성 제어: 동시성 제어란 공유자원을 두고 타투는 싸움!
    return { id, point: amount, updateMillis: Date.now() };
  }
}
