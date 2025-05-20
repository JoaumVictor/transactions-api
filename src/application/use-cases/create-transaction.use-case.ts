import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';

interface CreateTransactionInput {
  amount: number;
  timestamp: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  execute({ amount, timestamp }: CreateTransactionInput): void {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      throw new BadRequestException(
        'A data informada está em formato inválido.',
      );
    }

    const transaction = new Transaction(amount, date);
    this.transactionRepository.save(transaction);
  }
}
