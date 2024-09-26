import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';

describe('MutexInterceptor', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('충전 요청을 동시에 보냅니다.', async () => {
    const userId = 1;

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

    // 동시 요청을 보내고, 순차적으로 처리되는지 확인
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

    console.log(test.body);
  });

  it('충전, 이용 요청이 들어올 경우 순차적으로 처리됩니다.', async () => {
    const id = 1;

    const promise0 = request(app.getHttpServer())
      .patch(`/point/${id}/charge`)
      .send({ amount: 10000 })
      .expect(200);

    const promise1 = request(app.getHttpServer())
      .patch(`/point/${id}/use`)
      .send({ amount: 10000 })
      .expect(200);

    const promise2 = request(app.getHttpServer())
      .patch(`/point/${id}/charge`)
      .send({ amount: 20000 })
      .expect(200);

    // 동시 요청을 보내고, 순차적으로 처리되는지 확인
    const [response1, response2, response3] = await Promise.all([
      promise0,
      promise1,
      promise2,
    ]);

    const test = await request(app.getHttpServer()).get(
      `/point/${id}/histories`,
    );
    console.log(test.body);
  });

  it('충전, 이용 요청이 들어올 경우 순차적으로 처리됩니다.', async () => {
    const id = 1;

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
    console.log(test.body);
  });

  afterAll(async () => {
    await app.close();
  });
});
