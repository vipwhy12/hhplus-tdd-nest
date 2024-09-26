import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { DatabaseModule } from '../database/database.module';
import { PointService } from './point.service';
import { PointRepository } from './point.repository';
import { Mutex } from '../mutex/mutex';

@Module({
  imports: [DatabaseModule],
  controllers: [PointController],
  providers: [PointService, PointRepository, Mutex],
})
export class PointModule {}
