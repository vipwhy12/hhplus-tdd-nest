import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PointService } from './point.service';
import { PointRepository } from './point.repository';
import { PointHistory, TransactionType, UserPoint } from './point.model';
import { BadRequestException } from '@nestjs/common';

describe('PointService', () => {
  let pointService: PointService;
  let pointRepoitory: DeepMocked<PointRepository>;

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
    pointRepoitory = module.get(PointRepository);
  });

  it('should be defined', () => {
    expect(pointService).toBeDefined();
  });

  //유저의 아이디가 정상일 때 성공적으로 의도된 값을 반환하는지 확인합니다.
  describe('getPointById', () => {
    describe('유저의 아이디가 정상일 때 ', () => {
      const userId = 1;
      const mockUserPoint: UserPoint = {
        id: userId,
        point: 1000,
        updateMillis: Date.now(),
      };
      it('성공한다', async () => {
        pointRepoitory.getPointById.mockResolvedValue(mockUserPoint);

        const result = await pointService.getPointById(userId);

        expect(result).toEqual(mockUserPoint);
      });
    });
  });

  describe('history', () => {
    //유저의 아이디가 정상일때, 해당 유저의 히스토리를 잘 반환하는지 확인합니다.
    describe('유저의 아이디를 전달했을 때', () => {
      const userId = 1;
      const mockHistory: PointHistory[] = [
        {
          id: 1,
          userId,
          type: TransactionType.CHARGE,
          amount: 1000,
          timeMillis: Date.now(),
        },
        {
          id: 2,
          userId,
          type: TransactionType.USE,
          amount: -500,
          timeMillis: Date.now(),
        },
      ];
      it('성공한다.', async () => {
        // Given
        pointRepoitory.getHistoryId.mockResolvedValue(mockHistory);

        // When
        const result = await pointService.history(userId);

        // Then
        expect(pointRepoitory.getHistoryId).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mockHistory);
      });
    });
  });

  describe('charge', () => {
    //유저의 포인트를 정상적으로 전달 했을 때, 성공하는지 확인합니다.
    describe('유저의 포인트를 전달했을 때', () => {
      const userId = 1;
      const amount = 1000;
      const mockUserPoint: UserPoint = {
        id: userId,
        point: amount,
        updateMillis: Date.now(),
      };

      it('성공한다.', async () => {
        pointRepoitory.upsertPoint.mockResolvedValue(mockUserPoint);

        // When
        const result = await pointService.charge(userId, amount);

        expect(result).toEqual(mockUserPoint);
      });
    });
  });

  describe('use', () => {
    /** 행동분석
     * 1. 유저의 포인트를 조회한다.
     * 2. 유저의 포인트와 사용할 포인트를 대조한다.
     * 3. 유저의 포인트가 충분하다면 사용한다.
     * 4. 유저의 포인트가 충분하지 않다면
     */

    //유저의 포인트가 충분할 때, 에러가 발생하는 지 확인합니다.
    describe('포인트가 충분하지 않을 때', () => {
      //Given
      const id = 1;
      const amout = 50000;
      const userPoint = { id, point: 1000, updateMillis: 20 };
      const expectResult = BadRequestException;

      it('실패한다.', async () => {
        pointRepoitory.getPointById.mockResolvedValue(userPoint);

        await expect(pointService.use(id, amout)).rejects.toBeInstanceOf(
          expectResult,
        );
      });
    });

    //유저의 포인트가 충분할 때, 충전이 잘 되는지 확인합니다.
    describe('유저의 포인트가 충분할 때', () => {
      //Give
      const validId = 1;
      const amount = 10000;
      const userPoint = { id: validId, point: amount, updateMillis: 20 };
      const usePoint = { id: validId, point: 0, updateMillis: 20 };

      it('성공한다.', async () => {
        pointRepoitory.getPointById.mockResolvedValue(userPoint);
        pointRepoitory.upsertPoint.mockResolvedValue(usePoint);

        expect(await pointService.use(validId, amount)).toEqual(usePoint);
      });
    });
  });
});
