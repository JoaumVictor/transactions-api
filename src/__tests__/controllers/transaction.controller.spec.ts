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

  it('deve retornar 201 quando uma transação válida é enviada', async () => {
    const payload = {
      amount: 150.75,
      timestamp: new Date().toISOString(),
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
