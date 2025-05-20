import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { Transaction } from 'src/domain/entities/transaction.entity';

@Injectable()
export class InMemoryTransactionRepository implements TransactionRepository {
  private transactions: Transaction[] = [];

  save(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  findAll(): Transaction[] {
    return this.transactions;
  }

  clear(): void {
    this.transactions = [];
  }

  findLast60Seconds(): Transaction[] {
    const now = Date.now();
    return this.transactions.filter(
      (tx) => now - tx.timestamp.getTime() <= 60_000,
    );
  }
}
