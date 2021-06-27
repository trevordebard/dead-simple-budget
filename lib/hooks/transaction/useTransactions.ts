import { useQuery } from 'react-query';
import { Transaction } from '.prisma/client';
import axios from 'axios';

export function useTransactions() {
  return useQuery('fetch-transactions', fetchTransactions);
}

async function fetchTransactions() {
  const response = await axios.get<Transaction[]>('/api/transactions');
  return response.data;
}
