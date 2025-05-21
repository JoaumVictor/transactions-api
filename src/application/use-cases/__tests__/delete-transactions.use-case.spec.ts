import { DeleteTransactionsUseCase } from '../delete-transactions.use-case';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';

describe('DeleteTransactionsUseCase', () => {
  let useCase: DeleteTransactionsUseCase;
  let mockRepository: TransactionRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      clear: jest.fn(),
      findLast60Seconds: jest.fn(),
    };

    useCase = new DeleteTransactionsUseCase(mockRepository);
  });

  it('deve chamar o método clear() do repositório', () => {
    useCase.execute();

    expect(mockRepository.clear).toHaveBeenCalledTimes(1);
  });
});
