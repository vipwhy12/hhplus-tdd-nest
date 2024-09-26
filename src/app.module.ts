import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PointModule } from './point/point.module';
import { MutexModule } from './mutex/mutex.module';

@Module({
  imports: [PointModule, MutexModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
