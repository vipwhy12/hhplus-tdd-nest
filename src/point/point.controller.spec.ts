import { PointService } from './point.service';
import { PointController } from './point.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('PointController', () => {
  let pointController: PointController;
  let pointService: DeepMocked<PointService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointController],
      providers: [
        {
          provide: PointService,
          useValue: createMock<PointService>(),
        },
      ],
    }).compile();

    pointController = module.get<PointController>(PointController);
    pointService = module.get(PointService);
  });
});
