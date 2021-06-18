import { Transaction } from '.prisma/client';
import axios from 'axios';
import { iDeleteTransactionsInput } from 'types/transactions';

async function deleteTransactions(transactionIds: iDeleteTransactionsInput) {
  const response = await axios.delete<Transaction>(`/api/transactions`, { data: transactionIds });
  return response;
}

export { deleteTransactions };
