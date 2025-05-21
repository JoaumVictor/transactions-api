import { Body, Controller, Post, HttpCode, Delete } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.use-case';
import { DeleteTransactionsUseCase } from './../../application/use-cases/delete-transactions.use-case';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteTransactionsUseCase: DeleteTransactionsUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateTransactionDto) {
    this.createTransactionUseCase.execute(body);
  }

  @Delete()
  @HttpCode(200)
  deleteAll() {
    this.deleteTransactionsUseCase.execute();
  }
}
