import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PointService } from './point.service';
import { PointRepository } from './point.repository';

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

  describe('getPointById', () => {});

  describe('history', () => {});

  describe('charge', () => {
    /** 행동분석
     * 1. 유저의 point를 충전한다.
     * 2. 유저의 history를 생성한다.
     * 3. 결과를 반환한다.
     */
  });

  describe('use', () => {
    /** 행동분석
     * 1. 유저의 포인트를 조회한다.
     * 2. 유저의 포인트와 사용할 포인트를 대조한다.
     * 3. 유저의 포인트가 충분하다면 사용한다.
     * 4. 유저의 포인트가 충분하지 않다면
     */

    describe('포인트가 충분하지 않을 때', () => {
      //Given
      const id = 1;
      const amout = 50000;
      const userPoint = { id, point: 1000, updateMillis: 20 };
      const expectResult = Error;

      //TODO ERR
      it('거절한다.', async () => {
        pointRepoitory.getPointById.mockResolvedValue(userPoint);

        await expect(pointService.use(id, amout)).rejects.toBeInstanceOf(
          expectResult,
        );
      });
    });

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
