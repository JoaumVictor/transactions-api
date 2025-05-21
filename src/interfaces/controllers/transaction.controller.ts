import { Body, Controller, Post, HttpCode, Delete } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.use-case';
import { DeleteTransactionsUseCase } from './../../application/use-cases/delete-transactions.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteTransactionsUseCase: DeleteTransactionsUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Criar uma nova transação' })
  @ApiResponse({
    status: 201,
    description: 'Transação registrada com sucesso.',
  })
  @ApiResponse({
    status: 422,
    description: 'Transação inválida (valor ou data futura).',
  })
  @ApiResponse({ status: 400, description: 'Requisição malformada.' })
  create(@Body() body: CreateTransactionDto) {
    this.createTransactionUseCase.execute(body);
  }

  @Delete()
  @HttpCode(200)
  @ApiOperation({ summary: 'Remover todas as transações' })
  @ApiResponse({
    status: 200,
    description: 'Todas as transações foram removidas com sucesso.',
  })
  deleteAll() {
    this.deleteTransactionsUseCase.execute();
  }
}
