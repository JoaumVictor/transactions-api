import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';

@Injectable()
export class GetAllTransactionsUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  execute(): Transaction[] {
    return this.transactionRepository.findAll();
  }
}
