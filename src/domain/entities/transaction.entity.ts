import { UnprocessableEntityException } from '@nestjs/common';

export class Transaction {
  public readonly amount: number;
  public readonly timestamp: Date;

  constructor(amount: number, timestamp: Date) {
    if (amount < 0) {
      throw new UnprocessableEntityException('Amount não pode ser negativo');
    }

    this.amount = amount;
    this.timestamp = timestamp;
  }
}
