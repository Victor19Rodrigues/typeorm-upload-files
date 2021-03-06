import fs from 'fs';
import csvParse from 'csv-parse';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface RequestDTO {
  filePath: string;
}

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ filePath }: RequestDTO): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const parsers = csvParse({ ltrim: true, from_line: 2 });

    const csvReadStream = fs.createReadStream(filePath);

    const parseCSV = csvReadStream.pipe(parsers);

    const importedTransactions: TransactionDTO[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line;

      if (!title || !type || !value) {
        return;
      }

      importedTransactions.push({ title, type, value, category });
    });

    await new Promise((resolve, reject) => {
      parseCSV.on('error', err => reject(err));
      parseCSV.on('end', resolve);
    });

    const storedTransaction: Transaction[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const transaction of importedTransactions) {
      // eslint-disable-next-line no-await-in-loop
      const newTransaction = await createTransaction.execute({
        ...transaction,
      });

      storedTransaction.push(newTransaction);
    }

    await fs.promises.unlink(filePath);

    return storedTransaction;
  }
}

export default ImportTransactionsService;
