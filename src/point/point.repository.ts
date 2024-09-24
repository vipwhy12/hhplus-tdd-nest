import { Injectable } from '@nestjs/common';
import { UserPointTable } from '../database/userpoint.table';
import { PointHistoryTable } from '../database/pointhistory.table';
import { PointHistory, TransactionType, UserPoint } from './point.model';

@Injectable()
export class PointRepository {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historydb: PointHistoryTable,
  ) {}

  async getPointById(id: number): Promise<UserPoint> {
    return await this.userDb.selectById(id);
  }

  async getHistoryId(id: number): Promise<PointHistory[]> {
    return await this.historydb.selectAllByUserId(id);
  }

  async setHisotryId(
    id: number,
    amout: number,
    transactionType: TransactionType,
    updateMillis: number,
  ) {
    return await this.historydb.insert(
      id,
      amout,
      transactionType,
      updateMillis,
    );
  }

  async charge(id: number, amount: number): Promise<UserPoint> {
    return await this.userDb.insertOrUpdate(id, amount);
  }
}
