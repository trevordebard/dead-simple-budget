import { Transaction } from '.prisma/client';
import axios from 'axios';

async function fetchTransactionById({ queryKey }) {
  const [_, { transactionId }] = queryKey;
  const response = await axios.get<Transaction>(`/api/transaction/${transactionId}`);
  return response;
}

export { fetchTransactionById };
