import { CreateTransactionUseCase } from '../create-transaction.use-case';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let mockRepository: TransactionRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      clear: jest.fn(),
      findLast60Seconds: jest.fn(),
    };

    useCase = new CreateTransactionUseCase(mockRepository);
  });

  it('deve criar uma transação válida com sucesso', () => {
    const now = new Date();
    const input = {
      amount: 100.5,
      timestamp: now.toISOString(),
    };

    useCase.execute(input);

    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('deve lançar erro 400 se o timestamp for inválido', () => {
    const input = {
      amount: 100.5,
      timestamp: 'data-invalida',
    };

    expect(() => useCase.execute(input)).toThrow(BadRequestException);
  });

  it('deve lançar erro 422 se o timestamp for no futuro', () => {
    const future = new Date(Date.now() + 60_000);

    const input = {
      amount: 100.5,
      timestamp: future.toISOString(),
    };

    expect(() => useCase.execute(input)).toThrow(UnprocessableEntityException);
  });

  it('deve lançar erro 422 se o amount for negativo', () => {
    const now = Date.now();
    const input = {
      amount: -5,
      timestamp: new Date(now).toISOString(),
    };

    expect(() => useCase.execute(input)).toThrow(UnprocessableEntityException);
  });
});
