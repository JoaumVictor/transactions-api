import { GetStatisticsUseCase } from '../get-statistics.use-case';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { Transaction } from 'src/domain/entities/transaction.entity';

describe('GetStatisticsUseCase', () => {
  let useCase: GetStatisticsUseCase;
  let mockRepository: TransactionRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      clear: jest.fn(),
      findLast60Seconds: jest.fn(),
    };

    useCase = new GetStatisticsUseCase(mockRepository);
  });

  it('deve retornar todos os valores como 0 se não houver transações', () => {
    jest.spyOn(mockRepository, 'findLast60Seconds').mockReturnValue([]);

    const result = useCase.execute();

    expect(result).toEqual({
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
    });
  });

  it('deve calcular corretamente os valores com múltiplas transações', () => {
    const transactions: Transaction[] = [
      new Transaction(100, new Date()),
      new Transaction(200, new Date()),
      new Transaction(50, new Date()),
    ];

    jest
      .spyOn(mockRepository, 'findLast60Seconds')
      .mockReturnValue(transactions);

    const result = useCase.execute();

    expect(result.count).toBe(3);
    expect(result.sum).toBe(350);
    expect(result.avg).toBeCloseTo(116.66, 1);
    expect(result.min).toBe(50);
    expect(result.max).toBe(200);
  });
});
