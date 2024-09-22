import { PointService } from './point.service';
import { PointController } from './point.controller';
import { Test, TestingModule } from '@nestjs/testing';
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

  describe('point 조회시,', () => {
    describe('id가 1보다 작으면', () => {
      const invalidId = -1;
      const errorMessage = 'ID는 1보다 커야 합니다';

      // 유효하지 않은 ID로 조회할 때, 컨트롤러는 서비스가 던지는 에러를 그대로 반환하는지 테스트합니다.
      it('실패 응답을 반환한다.', async () => {
        pointService.point.mockRejectedValue(new Error(errorMessage));

        await expect(pointController.point(invalidId)).rejects.toThrowError(
          errorMessage,
        );
        expect(pointService.point).toHaveBeenCalledWith(invalidId);
      });
    });

    describe('id가 1보다 크면', () => {
      const validId = 1;
      const expectedResult = { id: 1, point: 1, updateMillis: Date.now() };

      // 유효한 ID로 조회할 때, 컨트롤러는 서비스가 던지는 응답을 그대로 반환하는지 테스트 합니다.
      it('성공 응답을 반환한다.', async () => {
        pointService.point.mockResolvedValue(expectedResult);

        const result = await pointController.point(validId);

        expect(result).toEqual(expectedResult);
        expect(pointService.point).toHaveBeenCalledWith(validId);
      });
    });
  });
});
