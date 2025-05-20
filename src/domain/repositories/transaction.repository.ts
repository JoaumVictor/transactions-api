import { Transaction } from '../entities/transaction.entity';

export abstract class TransactionRepository {
  abstract save(transaction: Transaction): void;
  abstract findAll(): Transaction[];
  abstract clear(): void;
  abstract findLast60Seconds(): Transaction[];
}
