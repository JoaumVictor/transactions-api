import { IsNumber, IsISO8601, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber({}, { message: 'O valor da transação deve ser um número.' })
  @Min(0, { message: 'O valor da transação não pode ser negativo.' })
  amount: number;

  @IsISO8601(
    {},
    { message: 'A data da transação deve estar em formato ISO 8601.' },
  )
  timestamp: string;
}
