import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';

@Injectable()
export class GetStatisticsUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  execute() {
    const transactions = this.transactionRepository.findLast60Seconds();

    if (transactions.length === 0) {
      return {
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
      };
    }

    const amounts = transactions.map((t) => t.amount);
    const sum = amounts.reduce((a, b) => a + b, 0);
    const count = transactions.length;
    const avg = Math.round((sum / count) * 1e6) / 1e6;
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);

    return {
      count,
      sum,
      avg,
      min,
      max,
    };
  }
}
