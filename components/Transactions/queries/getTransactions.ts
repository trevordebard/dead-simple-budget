import { Transaction } from '.prisma/client';
import axios from 'axios';

async function fetchTransactions() {
  const response = await axios.get<Transaction[]>('/api/transactions');
  return response;
}

export { fetchTransactions };
