import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PointService } from './point.service';
import { UserPointTable } from '../database/userpoint.table';
import { UserPoint } from './point.model';

describe('PointService', () => {
  let pointService: PointService;
  let userPointTable: DeepMocked<UserPointTable>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        PointService,
        {
          provide: UserPointTable,
          useValue: createMock<UserPointTable>(),
        },
      ],
    }).compile();

    pointService = module.get<PointService>(PointService);
    userPointTable = module.get(UserPointTable);
  });

  describe('getPointById', () => {
    describe('id가 유효하지않으면', () => {
      const validId = -3;
      const errorMessage = 'Database error';

      it('실패한다.', async () => {
        userPointTable.selectById.mockRejectedValue(new Error(errorMessage));
        const expectedResult = () => userPointTable.selectById(validId);
        await expect(expectedResult).rejects.toThrow(errorMessage);
      });
    });

    describe('id가 유효하면', () => {
      const validId: number = 1;
      const expectedResult: UserPoint = {
        id: validId,
        point: 100,
        updateMillis: Date.now(),
      };

      it('성공적으로 유저 포인트를 반환한다.', async () => {
        userPointTable.selectById.mockResolvedValue(expectedResult);

        const result = await pointService.getPointById(validId);

        expect(result).toEqual(expectedResult);
        expect(userPointTable.selectById).toHaveBeenCalledWith(validId);
      });
    });
  });
});
