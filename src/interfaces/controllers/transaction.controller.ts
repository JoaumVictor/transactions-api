import {
  Body,
  Controller,
  Post,
  HttpCode,
  Delete,
  Inject,
  Get,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.use-case';
import { DeleteTransactionsUseCase } from './../../application/use-cases/delete-transactions.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { GetAllTransactionsUseCase } from 'src/application/use-cases/get-all-transactions.use-case';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject('Logger') private readonly logger: Logger,
    private readonly getAllTransactionsUseCase: GetAllTransactionsUseCase,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteTransactionsUseCase: DeleteTransactionsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as transações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações retornada com sucesso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao processar a requisição.',
  })
  getAll() {
    this.logger.log('Listando todas as transações');
    try {
      return this.getAllTransactionsUseCase.execute();
    } catch (error) {
      this.logger.error('Falha ao listar transações', error);
      throw error;
    }
  }

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
    this.logger.log('Criando nova transação');
    this.logger.debug({ payload: body }, 'Debug detalhado');
    try {
      this.createTransactionUseCase.execute(body);
    } catch (error) {
      this.logger.error(
        `Falha ao criar transação: ${JSON.stringify(body)}`,
        error,
      );
      throw error;
    }
  }

  @Delete()
  @HttpCode(200)
  @ApiOperation({ summary: 'Remover todas as transações' })
  @ApiResponse({
    status: 200,
    description: 'Todas as transações foram removidas com sucesso.',
  })
  deleteAll() {
    this.logger.log('Deletando todos os registros de transações');
    try {
      this.deleteTransactionsUseCase.execute();
    } catch (error) {
      this.logger.error(
        `Falha ao deletar todos os registros de transações`,
        error,
      );
    }
  }
}
