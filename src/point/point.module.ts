import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PointService } from './point.service';
import { PointRepository } from './point.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PointController],
  providers: [PointService, PointRepository],
})
export class PointModule {}
