import { Module } from '@nestjs/common';
import { TransactionController } from './interfaces/controllers/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { InMemoryTransactionRepository } from './infra/repositories/in-memory/in-memory-transaction.repository';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    {
      provide: 'TransactionRepository',
      useClass: InMemoryTransactionRepository,
    },
  ],
})
export class AppModule {}
