import { Transaction } from '.prisma/client';
import axios from 'axios';
import { iEditTransactionInput } from 'types/transactions';

interface params {
  transactionId: number;
  transactionInput: iEditTransactionInput;
}
async function editTransaction(transaction: params) {
  console.log(transaction.transactionId);
  console.log(transaction.transactionInput);
  const response = await axios.put<Transaction>(
    `/api/transaction/${transaction.transactionId}`,
    transaction.transactionInput
  );
  return response;
}

export { editTransaction };
