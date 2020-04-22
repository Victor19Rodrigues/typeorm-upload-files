// import AppError from '../errors/AppError';

// import Transaction from '../models/Transaction';

// interface RequestDTO {
//   title: string;
//   value: number;
//   type: 'income' | 'outcome';
// }

// class CreateTransactionService {
//   public async execute({
//     title,
//     type,
//     value,
//   }: RequestDTO): Promise<Transaction> {
//     const { total } = this.transactionsRepository.getBalance();

//     if (total < value && type === 'outcome') {
//       throw new AppError("You don't have enough balance.");
//     }

//     const transaction = this.transactionsRepository.create({
//       title,
//       value,
//       type,
//     });

//     return transaction;
//   }
// }

// export default CreateTransactionService;
