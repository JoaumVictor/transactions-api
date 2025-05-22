import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { InMemoryTransactionRepository } from 'src/infra/repositories/in-memory/in-memory-transaction.repository';
import { Transaction } from 'src/domain/entities/transaction.entity';

describe('StatisticsController (e2e)', () => {
  let app: INestApplication;
  let transactionRepository: InMemoryTransactionRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('TransactionRepository')
      .useClass(InMemoryTransactionRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    transactionRepository = moduleFixture.get<InMemoryTransactionRepository>(
      'TransactionRepository',
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /statistics', () => {
    it('deve retornar 200 e estatísticas zeradas quando não há transações', async () => {
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

    it('deve retornar 200 e estatísticas corretas para transações nos últimos 60 segundos', async () => {
      const transactions: Transaction[] = [
        { amount: 100, timestamp: new Date(Date.now() - 10000) },
        { amount: 200, timestamp: new Date(Date.now() - 20000) },
      ];

      transactions.forEach((tx) => transactionRepository.save(tx));

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      expect(response.body).toEqual({
        count: 2,
        sum: 300,
        avg: 150,
        min: 100,
        max: 200,
      });
    });

    it('deve excluir transações fora dos 60 segundos', async () => {
      const transactions: Transaction[] = [
        { amount: 100, timestamp: new Date(Date.now() - 10000) },
        { amount: 200, timestamp: new Date(Date.now() - 70000) },
      ];

      transactions.forEach((tx) => transactionRepository.save(tx));

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      expect(response.body).toEqual({
        count: 1,
        sum: 100,
        avg: 100,
        min: 100,
        max: 100,
      });
    });

    it('deve calcular estatísticas corretamente para múltiplas transações', async () => {
      const transactions: Transaction[] = [
        { amount: 50, timestamp: new Date(Date.now() - 5000) },
        { amount: 150, timestamp: new Date(Date.now() - 15000) },
        { amount: 250, timestamp: new Date(Date.now() - 25000) },
      ];

      transactions.forEach((tx) => transactionRepository.save(tx));

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      expect(response.body).toEqual({
        count: 3,
        sum: 450,
        avg: 150,
        min: 50,
        max: 250,
      });
    });

    it('deve lidar com grande volume de transações (stress test)', async () => {
      const transactions: Transaction[] = Array.from(
        { length: 1000 },
        (_, i) => ({
          amount: 10 + i,
          timestamp: new Date(Date.now() - i * 50), // Transações espaçadas em 50ms
        }),
      );

      transactions.forEach((tx) => transactionRepository.save(tx));

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      expect(response.body).toEqual({
        count: 1000,
        sum: 509500,
        avg: 509.5,
        min: 10,
        max: 1009,
      });
    });

    it('deve lidar com valores extremos (muito altos e próximos de zero)', async () => {
      const transactions: Transaction[] = [
        {
          amount: Number.MAX_SAFE_INTEGER,
          timestamp: new Date(Date.now() - 10000),
        },
        { amount: 0.000001, timestamp: new Date(Date.now() - 20000) },
      ];

      transactions.forEach((tx) => transactionRepository.save(tx));

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      expect(response.body).toEqual({
        count: 2,
        sum: Number.MAX_SAFE_INTEGER + 0.000001,
        avg: (Number.MAX_SAFE_INTEGER + 0.000001) / 2,
        min: 0.000001,
        max: Number.MAX_SAFE_INTEGER,
      });
    });

    it('deve suportar múltiplas requisições rápidas (rate limiting)', async () => {
      const transactions: Transaction[] = [
        { amount: 100, timestamp: new Date(Date.now() - 10000) },
      ];
      transactionRepository.save(transactions[0]);

      // Simula 50 requisições rápidas
      const requests = Array.from({ length: 50 }, () =>
        request(app.getHttpServer()).get('/statistics'),
      );

      const responses = await Promise.all(requests);
      let successCount = 0;
      responses.forEach((response) => {
        if (response.status === 200) {
          successCount++;
          expect(response.body).toEqual({
            count: 1,
            sum: 100,
            avg: 100,
            min: 100,
            max: 100,
          });
        } else {
          expect(response.status).toBe(429);
        }
      });
      expect(successCount).toBeGreaterThan(0);
    });

    it('deve lidar com transações próximas ao limite de 60 segundos', async () => {
      const now = Date.now();
      const transactions: Transaction[] = [
        { amount: 100, timestamp: new Date(now - 1000) },
        { amount: 200, timestamp: new Date(now - 59999) },
        { amount: 300, timestamp: new Date(now - 60001) },
      ];

      transactions.forEach((tx) => {
        console.log('Saving transaction:', tx);
        transactionRepository.save(tx);
      });

      // Mock Date.now para usar o mesmo 'now' do teste
      jest.spyOn(global.Date, 'now').mockReturnValue(now);

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      console.log('Response:', response.body);
      expect(response.body).toEqual({
        count: 2,
        sum: 300,
        avg: 150,
        min: 100,
        max: 200,
      });

      // Restaura o mock
      jest.spyOn(global.Date, 'now').mockRestore();
    });

    it('deve calcular estatísticas corretamente para números flutuantes variados', async () => {
      const transactions: Transaction[] = [
        { amount: 12.34, timestamp: new Date(Date.now() - 10000) },
        { amount: 56.789, timestamp: new Date(Date.now() - 20000) },
        { amount: 0.001, timestamp: new Date(Date.now() - 30000) },
      ];

      transactions.forEach((tx) => {
        console.log('Saving transaction:', {
          amount: tx.amount,
          timestamp: tx.timestamp.getTime(),
        });
        transactionRepository.save(tx);
      });

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      console.log('Response:', response.body);
      expect(response.body).toEqual({
        count: 3,
        sum: 69.13000000000001,
        avg: 23.043333,
        min: 0.001,
        max: 56.789,
      });
    });

    it('deve lidar com números flutuantes próximos ao limite de precisão', async () => {
      const transactions: Transaction[] = [
        { amount: 0.0000001, timestamp: new Date(Date.now() - 10000) },
        { amount: 123.456789123456, timestamp: new Date(Date.now() - 20000) },
      ];

      transactions.forEach((tx) => {
        console.log('Saving transaction:', {
          amount: tx.amount,
          timestamp: tx.timestamp.getTime(),
        });
        transactionRepository.save(tx);
      });

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      console.log('Response:', response.body);
      expect(response.body).toEqual({
        count: 2,
        sum: 123.456789223456,
        avg: 61.728395,
        min: 0.0000001,
        max: 123.456789123456,
      });
    });
  });
});
