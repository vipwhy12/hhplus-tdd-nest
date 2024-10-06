import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as request from 'supertest';

describe('MutexInterceptor', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('point concurrent', () => {
    describe('사용', () => {
      // API 호출을 동시에 처리하는 상황에서 동시성 제어가 제대로 작동하는지 테스트합니다.
      describe('동시에 요청을 보낼 때,', () => {
        const userId = 1;
        const expectResult = [
          { id: 1, userId: 1, amount: 10000, type: 0 },
          { id: 2, userId: 1, amount: 200, type: 1 },
          { id: 3, userId: 1, amount: 300, type: 1 },
        ];

        it('순차적으로 응답합니다.', async () => {
          const promise1 = request(app.getHttpServer())
            .patch(`/point/${userId}/charge`)
            .send({ amount: 10000 })
            .expect(200);

          const promise2 = request(app.getHttpServer())
            .patch(`/point/${userId}/use`)
            .send({ amount: 200 })
            .expect(200);

          const promise3 = request(app.getHttpServer())
            .patch(`/point/${userId}/use`)
            .send({ amount: 300 })
            .expect(200);

          const [response1, response2, response3] = await Promise.all([
            promise1,
            promise2,
            promise3,
          ]);

          const test = await request(app.getHttpServer()).get(
            `/point/${userId}/histories`,
          );

          // 각 응답이 올바르게 처리되었는지 확인
          expect(response1.body.point).toBe(10000);
          expect(response2.body.point).toBe(9800);
          expect(response3.body.point).toBe(9500);

          const result = test.body.map(({ timeMillis, ...rest }) => rest);
          expect(result).toEqual(expectResult);
        });
      });
    });

    describe('충전', () => {
      //여러 충전 요청이 동시에 들어오는 경우, 요청이 순차적으로 처리되고 결과가 기대한 대로 나오는지 검증하기 위한 테스트입니다.
      describe('동시에 요청을 보낼 때,', () => {
        const userId = 1;
        const expectResult = [
          { id: 1, userId: 1, amount: 100, type: 0 },
          { id: 2, userId: 1, amount: 200, type: 0 },
          { id: 3, userId: 1, amount: 300, type: 0 },
        ];

        it('순차적으로 응답합니다.', async () => {
          const promise1 = request(app.getHttpServer())
            .patch(`/point/${userId}/charge`)
            .send({ amount: 100 })
            .expect(200);

          const promise2 = request(app.getHttpServer())
            .patch(`/point/${userId}/charge`)
            .send({ amount: 200 })
            .expect(200);

          const promise3 = request(app.getHttpServer())
            .patch(`/point/${userId}/charge`)
            .send({ amount: 300 })
            .expect(200);

          const [response1, response2, response3] = await Promise.all([
            promise1,
            promise2,
            promise3,
          ]);

          const test = await request(app.getHttpServer()).get(
            `/point/${userId}/histories`,
          );

          // 각 응답이 올바르게 처리되었는지 확인
          expect(response1.body.point).toBe(100);
          expect(response2.body.point).toBe(200);
          expect(response3.body.point).toBe(300);

          const result = test.body.map(({ timeMillis, ...rest }) => rest);
          expect(result).toEqual(expectResult);
        });
      });
    });
  });

  describe('사용과 충전', () => {
    //사용 금액이 충전 금액을 초과하는 상황에서 에러가 발생하고, 다른 정상적인 요청이 올바르게 처리되는지 확인하는 테스트입니다.
    describe('충전 금액보다 사용 금액이 많을 때', () => {
      const id = 1;
      const expectResult = [
        {
          id: 1,
          userId: 1,
          amount: 10000,
          type: 0,
        },
        {
          id: 2,
          userId: 1,
          amount: 20000,
          type: 0,
        },
      ];

      it('거절되고 나머지 요청은 순차적으로 반영됩니다.', async () => {
        const promise0 = request(app.getHttpServer())
          .patch(`/point/${id}/charge`)
          .send({ amount: 10000 })
          .expect(200);

        const promise1 = request(app.getHttpServer())
          .patch(`/point/${id}/use`)
          .send({ amount: 50000 })
          .expect(400);

        const promise2 = request(app.getHttpServer())
          .patch(`/point/${id}/charge`)
          .send({ amount: 20000 })
          .expect(200);

        const [response1, response2, response3] = await Promise.all([
          promise0,
          promise1,
          promise2,
        ]);

        const test = await request(app.getHttpServer()).get(
          `/point/${id}/histories`,
        );
        const result = test.body.map(({ timeMillis, ...rest }) => rest);

        expect(result).toEqual(expectResult);
      });
    });

    //충전 요청과 이용 요청이 동시에 들어오는 경우, 요청이 순차적으로 처리되는지를 확인하기 위한 테스트입니다.
    describe('이용 요청이 들어올 경우', () => {
      const id = 1;
      const expectResult = [
        {
          id: 1,
          userId: 1,
          amount: 10000,
          type: 0,
        },
      ];

      it('순차적으로 처리됩니다.', async () => {
        const promise0 = request(app.getHttpServer())
          .patch(`/point/${id}/charge`)
          .send({ amount: 10000 })
          .expect(200);

        const promise1 = request(app.getHttpServer())
          .patch(`/point/${id}/use`)
          .send({ amount: 100000 })
          .expect(400);

        // 동시 요청을 보내고, 순차적으로 처리되는지 확인
        const [response1, response2] = await Promise.all([promise0, promise1]);

        const test = await request(app.getHttpServer()).get(
          `/point/${id}/histories`,
        );
        const result = test.body.map(({ timeMillis, ...rest }) => rest);
        expect(result).toEqual(expectResult);
      });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
