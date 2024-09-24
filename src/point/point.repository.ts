import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserPointTable } from '../database/userpoint.table';
import { PointHistoryTable } from '../database/pointhistory.table';
import { PointHistory, UserPoint } from './point.model';

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
}
