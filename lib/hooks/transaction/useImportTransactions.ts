import { useQuery } from 'react-query';
import { Transaction } from '.prisma/client';
import { DateTime } from 'luxon';
import axios from 'axios';

interface iUITransaction extends Omit<Transaction, 'date'> {
  date: string;
}

export function useTransactions() {
  return useQuery('fetch-transactions', fetchTransactions);
}

async function fetchTransactions() {
  const response = await axios.get<iUITransaction[]>('/api/plaid/get_transactions');
  const transactions = response.data.sort((a, b) => {
    return DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis();
  });
  return response.data;
}
