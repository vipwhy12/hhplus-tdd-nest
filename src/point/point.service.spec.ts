import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PointService } from './point.service';
import { PointRepository } from '../point/point.repository';

describe('PointService', () => {
  let pointService: PointService;
  let userRepository: DeepMocked<PointRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        PointService,
        {
          provide: PointRepository,
          useValue: createMock<PointRepository>(),
        },
      ],
    }).compile();

    pointService = module.get<PointService>(PointService);
    userRepository = module.get(PointRepository);
  });

  it('should be defined', () => {
    expect(pointService).toBeDefined();
  });
});
