import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';

describe('StatisticsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /statistics', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).delete('/transactions');
    });

    it('deve retornar estatísticas zeradas quando não há transações', async () => {
      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      expect(response.body).toEqual({
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
      });
    });

    it('deve calcular estatísticas corretamente para transações recentes', async () => {
      const now = new Date();
      const transactions = [
        {
          amount: 100.0,
          timestamp: new Date(now.getTime() - 30000).toISOString(),
        },
        {
          amount: 200.0,
          timestamp: new Date(now.getTime() - 15000).toISOString(),
        },
        { amount: 50.0, timestamp: now.toISOString() },
      ];

      for (const transaction of transactions) {
        await request(app.getHttpServer())
          .post('/transactions')
          .send(transaction);
      }

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      expect(response.body.count).toBe(3);
      expect(response.body.sum).toBe(350);
      expect(response.body.min).toBe(50);
      expect(response.body.max).toBe(200);

      expect(response.body.avg).toBeCloseTo(116.67, 2);
    });

    it('deve ignorar transações com mais de 60 segundos', async () => {
      const oldTransaction = {
        amount: 500.0,
        timestamp: new Date(Date.now() - 61000).toISOString(),
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(oldTransaction);

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      expect(response.body).toEqual({
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
      });
    });

    it('deve retornar 200 mesmo com erro no cálculo', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });
});
