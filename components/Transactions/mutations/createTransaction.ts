import { Transaction } from '.prisma/client';
import axios from 'axios';
import { iCreateTransactionInput } from 'types/transactions';

interface params {
  transactionInput: iCreateTransactionInput;
}
async function createTransaction(transaction: params) {
  const response = await axios.post<Transaction>(`/api/transaction`, transaction.transactionInput);
  return response;
}

export { createTransaction };
