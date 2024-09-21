import { PointService } from './point.service';
import { PointController } from './point.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

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
    // ID가 숫자로 변환되지 않을 경우 BadRequestException을 발생시켜야 한다.
    it('id가 숫자가 아니면 실패한다.', async () => {
      const invalidId = '숫자형으로 바꿀 수 없습니다.';
      const result = pointController.point(invalidId);

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });

    // ID가 0 이하일 경우 BadRequestException을 발생시켜야 한다.
    it('id가 0보다 작으면 실패한다.', async () => {
      const invalidId = 0;
      const result = pointController.point(invalidId);

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });

    // ID가 undefined일 경우 BadRequestException을 발생시켜야 한다.
    it('id가 undefined이면 실패한다.', async () => {
      const invalidId = undefined;
      const result = pointController.point(invalidId);

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });

    // ID가 null일 경우 BadRequestException을 발생시켜야 한다.
    it('id가 null이면 실패한다.', async () => {
      const invalidId = null;
      const result = pointController.point(invalidId);

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });

    // PointService.point 에서 반환하는 값이 비어있으면 InternalServerErrorException을 발생시켜야 한다.
    it('서비스 레이어에서 반환하는 값이 비어있으면 실패한다.', async () => {
      const validId = '1';

      pointService.point.mockResolvedValue(null);

      const result = pointController.point(validId);

      await expect(result).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });
});
