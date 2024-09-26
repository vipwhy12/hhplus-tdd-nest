import { BadRequestException, Injectable } from '@nestjs/common';
import { PointHistory, UserPoint, TransactionType } from './point.model';
import { PointRepository } from './point.repository';

@Injectable()
export class PointService {
  constructor(private readonly pointRepository: PointRepository) {}

  async getPointById(id: number): Promise<UserPoint> {
    return await this.pointRepository.getPointById(id);
  }

  //특정 유저의 포인트 충전/이용 내역을 조회하는 기능
  async history(id: number): Promise<PointHistory[]> {
    return await this.pointRepository.getHistoryId(id);
  }

  //특정 유저의 포인트를 충전하는 기능
  async charge(id: number, amount: number): Promise<UserPoint> {
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

    if (point < amount)
      throw new BadRequestException(`${id}의 ${amount - point}point 부족`);

    const useUserPoint = await this.pointRepository.upsertPoint(
      id,
      amount - point,
    );

    await this.pointRepository.setHisotryId(
      id,
      amount,
      transactionType,
      useUserPoint.updateMillis,
    );
    return useUserPoint;
  }
}
