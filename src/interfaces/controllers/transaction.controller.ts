import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.use-case';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateTransactionDto) {
    this.createTransactionUseCase.execute(body);
  }
}
