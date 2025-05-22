import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /transactions', () => {
    it('deve retornar 201 quando uma transação válida é enviada', async () => {
      const now = Date.now();
      const payload = {
        amount: 150.75,
        timestamp: new Date(now).toISOString(),
      };

      const response = await request(app.getHttpServer())
        .post('/transactions')
        .send(payload);

      expect(response.status).toBe(201);
    });

    it('deve retornar 422 se o timestamp for no futuro', async () => {
      const payload = {
        amount: 150.75,
        timestamp: new Date(Date.now() + 60_000).toISOString(),
      };

      const response = await request(app.getHttpServer())
        .post('/transactions')
        .send(payload);

      expect(response.status).toBe(422);
    });

    it('deve retornar 400 se o payload for malformado', async () => {
      const response = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          amount: 'não é número',
          timestamp: 'também inválido',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /transactions', () => {
    it('deve retornar 200 e array vazio quando não há transações', async () => {
      await request(app.getHttpServer()).delete('/transactions');

      const response = await request(app.getHttpServer())
        .get('/transactions')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('deve retornar 200 com todas as transações cadastradas', async () => {
      const now = Date.now();
      const transactions = [
        { amount: 100.5, timestamp: new Date(now).toISOString() },
        {
          amount: 200.75,
          timestamp: new Date(Date.now() - 10000).toISOString(),
        },
      ];

      await request(app.getHttpServer())
        .post('/transactions')
        .send(transactions[0]);

      await request(app.getHttpServer())
        .post('/transactions')
        .send(transactions[1]);

      const response = await request(app.getHttpServer())
        .get('/transactions')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ amount: 100.5 }),
          expect.objectContaining({ amount: 200.75 }),
        ]),
      );
    });

    it('deve retornar transações no formato correto', async () => {
      const now = Date.now();
      await request(app.getHttpServer()).delete('/transactions');

      const testTransaction = {
        amount: 50.25,
        timestamp: new Date(now).toISOString(),
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(testTransaction);

      const response = await request(app.getHttpServer())
        .get('/transactions')
        .expect(200);

      const responseBody = response.body as Array<{
        amount: number;
        timestamp: string;
      }>;
      expect(responseBody[0]).toEqual({
        amount: testTransaction.amount,
        timestamp: testTransaction.timestamp,
      });
    });
  });

  describe('DELETE /transactions', () => {
    it('deve retornar 200 ao limpar transações', async () => {
      await request(app.getHttpServer()).delete('/transactions').expect(200);
    });
  });
});
