import { Module } from '@nestjs/common';
import { TransactionController } from './interfaces/controllers/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { InMemoryTransactionRepository } from './infra/repositories/in-memory/in-memory-transaction.repository';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DeleteTransactionsUseCase } from './application/use-cases/delete-transactions.use-case';
import { GetStatisticsUseCase } from './application/use-cases/get-statistics.use-case';
import { StatisticsController } from './interfaces/controllers/statistics.controller';
import { HealthController } from './interfaces/controllers/health.controller';
import { Logger, LoggerModule } from 'nestjs-pino';
import { loggerConfig } from './logger.config';
import { GetAllTransactionsUseCase } from './application/use-cases/get-all-transactions.use-case';

@Module({
  imports: [
    LoggerModule.forRoot(loggerConfig),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [TransactionController, StatisticsController, HealthController],
  providers: [
    GetAllTransactionsUseCase,
    CreateTransactionUseCase,
    DeleteTransactionsUseCase,
    GetStatisticsUseCase,
    {
      provide: 'TransactionRepository',
      useClass: InMemoryTransactionRepository,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: 'Logger',
      useClass: Logger,
    },
  ],
})
export class AppModule {}
