import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { DatabaseModule } from '../database/database.module';
import { PointService } from './point.service';
import { PointRepository } from './point.repository';
import { MutexModule } from '../mutex/mutex.module';

@Module({
  imports: [DatabaseModule, MutexModule],
  controllers: [PointController],
  providers: [PointService, PointRepository],
})
export class PointModule {}
