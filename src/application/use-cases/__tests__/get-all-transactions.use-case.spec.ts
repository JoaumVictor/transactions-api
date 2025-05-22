import { GetAllTransactionsUseCase } from '../get-all-transactions.use-case';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { Transaction } from 'src/domain/entities/transaction.entity';

describe('GetAllTransactionsUseCase', () => {
  let useCase: GetAllTransactionsUseCase;
  let mockRepository: TransactionRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      clear: jest.fn(),
      findLast60Seconds: jest.fn(),
    };

    useCase = new GetAllTransactionsUseCase(mockRepository);
  });

  it('deve retornar array vazio quando não há transações', () => {
    jest.spyOn(mockRepository, 'findAll').mockReturnValue([]);

    const result = useCase.execute();

    expect(result).toEqual([]);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve retornar todas as transações do repositório', () => {
    const mockTransactions: Transaction[] = [
      { amount: 100.5, timestamp: new Date('2025-05-21T10:00:00Z') },
      { amount: 200.75, timestamp: new Date('2025-05-21T11:00:00Z') },
    ];

    jest.spyOn(mockRepository, 'findAll').mockReturnValue(mockTransactions);

    const result = useCase.execute();

    expect(result).toEqual(mockTransactions);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve retornar cópia do array de transações (não a referência direta)', () => {
    const originalTransactions = [
      { amount: 50, timestamp: new Date('2025-05-21T12:00:00Z') },
    ];

    jest
      .spyOn(mockRepository, 'findAll')
      .mockImplementation(() => [...originalTransactions]);

    const result = useCase.execute();

    expect(result).toEqual(originalTransactions);
    expect(result).not.toBe(originalTransactions);
  });

  it('deve propagar erro se o repositório lançar exceção', () => {
    jest.spyOn(mockRepository, 'findAll').mockImplementation(() => {
      throw new Error('Erro simulado no repositório');
    });

    expect(() => useCase.execute()).toThrow('Erro simulado no repositório');
  });
});
