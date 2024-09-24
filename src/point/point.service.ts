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
    const userPoint: UserPoint = await this.upsertPoint(id, amount);
    const userHistory = await this.setHisotryId(
      id,
      amount,
      transactionType,
      userPoint.updateMillis,
    );

    return userPoint;
  }

  async use(id: number, amount: number): Promise<UserPoint> {
    //특정 유저의 포인트를 사용하는 기능을 작성해주세요.
    //TODO - Custom Error
    //TODO - 동시성 제어: 동시성 제어란 공유자원을 두고 타투는 싸움!
    /** 행동분석
     * 0. 유저의 포인트를 조회한다.
     * 1. 유저의 포인트와 사용할 포인트를 대조한다.
     * 2. 유저의 포인트가 충분하다면 사용한다.
     *    -> 유저의 포인트 사용
     *    -> 유저의 히스토리 생성
     * 3. 유저의 포인트가 충분하지 않다면
     *    -> 거절
     */
    const transactionType: TransactionType = TransactionType.USE;
    const userPoint = await this.pointRepository.getPointById(id);
    const point = userPoint.point;

    if (point < amount) {
      throw Error('포인트가 충분하지 않습니다.');
    }

    const useUserPoint = await this.upsertPoint(id, amount);
    const userHistory = await this.setHisotryId(
      id,
      amount,
      transactionType,
      useUserPoint.updateMillis,
    );
    return useUserPoint;
  }

  async upsertPoint(id: number, amount: number) {
    return await this.pointRepository.upsertPoint(id, amount);
  }

  async setHisotryId(
    id: number,
    amount: number,
    transactionType: TransactionType,
    updateMillis: number,
  ) {
    return await this.pointRepository.setHisotryId(
      id,
      amount,
      transactionType,
      updateMillis,
    );
  }
}
