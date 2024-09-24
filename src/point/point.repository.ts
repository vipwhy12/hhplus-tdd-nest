import { Injectable } from '@nestjs/common';
import { UserPointTable } from '../database/userpoint.table';
import { PointHistoryTable } from '../database/pointhistory.table';

@Injectable()
export class PointRepository {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historydb: PointHistoryTable,
  ) {}

  async getPointById(id: number) {
    return this.userDb.selectById(id);
  }
}
