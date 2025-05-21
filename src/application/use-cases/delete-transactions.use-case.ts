import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';

@Injectable()
export class DeleteTransactionsUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  execute(): void {
    this.transactionRepository.clear();
  }
}
