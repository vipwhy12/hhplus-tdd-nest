import { PointService } from './point.service';
import { PointController } from './point.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { MutexInterceptor } from '../common/interceptor/mutex.interceptor';
import { Mutex } from '../mutex/mutex';

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
        Mutex,
        {
          provide: MutexInterceptor,
          useValue: createMock<MutexInterceptor>(),
        },
      ],
    }).compile();

    pointController = module.get<PointController>(PointController);
    pointService = module.get(PointService);
  });

  it('should be defined', () => {
    expect(pointController).toBeDefined();
  });
});
