import { UnprocessableEntityException } from '@nestjs/common';

export class Transaction {
  public readonly amount: number;
  public readonly timestamp: Date;

  constructor(amount: number, timestamp: Date | string) {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

    if (amount < 0) {
      throw new UnprocessableEntityException('Amount não pode ser negativo');
    }

    this.amount = amount;
    this.timestamp = date;
  }
}
