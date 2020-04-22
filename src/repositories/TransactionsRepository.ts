import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsTypeIncome = await this.find({
      where: { type: 'income' },
    });
    const incomeTotal = transactionsTypeIncome.reduce(
      (previousValue, currentValue) =>
        previousValue + Number(currentValue.value),
      0,
    );

    const transactionsTypeOutcome = await this.find({
      where: { type: 'outcome' },
    });
    const outcomeTotal = transactionsTypeOutcome.reduce(
      (previousValue, currentValue) =>
        previousValue + Number(currentValue.value),
      0,
    );

    const balance = {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: incomeTotal - outcomeTotal,
    };

    return balance;
  }
}

export default TransactionsRepository;
