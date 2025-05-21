import {
  Injectable,
  BadRequestException,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
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
    const timestampMillis = new Date(timestamp).getTime();
    const nowMillis = Date.now();

    if (isNaN(timestampMillis)) {
      throw new BadRequestException(
        'A data informada está em formato inválido.',
      );
    }

    if (timestampMillis > nowMillis) {
      throw new UnprocessableEntityException(
        'A transação não pode estar no futuro.',
      );
    }

    const date = new Date(timestampMillis);
    const transaction = new Transaction(amount, date);
    this.transactionRepository.save(transaction);
  }
}
