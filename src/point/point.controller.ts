import { PointService } from './point.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { PointHistory, UserPoint } from './point.model';
import { PointBody as PointDto } from './point.dto';
import { ParseUserIdPipe } from '../pipes/parse.user.id.pipe';

@Controller('/point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get(':id')
  async point(@Param('id', ParseUserIdPipe) id: number): Promise<UserPoint> {
    return await this.pointService.getPointById(id);
  }

  @Get(':id/histories')
  async history(
    @Param('id', ParseUserIdPipe) id: number,
  ): Promise<PointHistory[]> {
    return await this.pointService.history(id);
  }

  @Patch(':id/charge')
  async charge(
    @Param('id', ParseUserIdPipe) id: number,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    const amount = pointDto.amount;
    return this.pointService.charge(id, amount);
  }

  /**
   * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
   */
  @Patch(':id/use')
  async use(
    @Param('id') id,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    const amount = pointDto.amount;
    return this.pointService.use(userId, amount);
  }
}
