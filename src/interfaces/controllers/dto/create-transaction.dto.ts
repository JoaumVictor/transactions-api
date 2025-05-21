import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsISO8601, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    example: 123.45,
    description: 'Valor decimal da transação (positivo ou zero)',
  })
  @IsNumber({}, { message: 'O valor da transação deve ser um número.' })
  @Min(0, { message: 'O valor da transação não pode ser negativo.' })
  amount: number;

  @ApiProperty({
    example: '2025-05-20T12:34:56.789Z',
    description: 'Data e hora da transação no formato ISO 8601 (UTC)',
  })
  @IsISO8601(
    {},
    { message: 'A data da transação deve estar em formato ISO 8601.' },
  )
  timestamp: string;
}
