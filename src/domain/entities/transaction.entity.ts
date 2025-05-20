export class Transaction {
  public readonly amount: number;
  public readonly timestamp: Date;

  constructor(amount: number, timestamp: Date) {
    if (amount < 0) {
      throw new Error('Amount não pode ser negativo');
    }

    const now = new Date();
    if (timestamp > now) {
      throw new Error('Timestamp não pode ser no futuro');
    }

    this.amount = amount;
    this.timestamp = timestamp;
  }
}
