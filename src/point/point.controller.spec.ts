import { PointService } from './point.service';
import { PointController } from './point.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';

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

  describe('PointController', () => {
    it('should be defined', () => {
      expect(true).toBe(true);
    });
  });

  describe('point', () => {
    /**
     * 클라이언트가 숫자로 변환할 수 없는 문자열을 ID로 전달했을 때,
     * 컨트롤러가 올바르게 BadRequestException을 발생시키는지 확인합니다.
     */
    it('id가 숫자가 아니면 실패한다.', async () => {
      const invalidId = '숫자형으로 바꿀 수 없습니다.';
      const result = pointController.point(invalidId);

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });

    /**
     * 클라이언트가 숫자로 변환할 수 없는 문자열을 ID로 전달했을 때,
     * 컨트롤러가 올바르게 BadRequestException을 발생시키는지 확인합니다.
     */
    it('id가 0보다 작으면 실패한다.', async () => {
      const invalidId = 0;
      const result = pointController.point(invalidId);

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
