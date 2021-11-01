import { useQuery, UseQueryOptions } from 'react-query';
import { Transaction } from '.prisma/client';
import { DateTime } from 'luxon';
import axios from 'axios';
import { Transaction as PlaidTransaction } from 'plaid';

interface iUITransaction extends Omit<Transaction, 'date'> {
  date: string;
}

export function useGetTransactionsFromBank(options: UseQueryOptions<iUITransaction[], unknown, PlaidTransaction[]>) {
  return useQuery(['fetch-transactions-from-bank', options.queryKey], fetchTransactions, {
    staleTime: 10800000, // 3hrs
    ...options,
  });
}

async function fetchTransactions({ queryKey }) {
  const [_, dateRage] = queryKey;
  const response = await axios.get<iUITransaction[]>(`/api/plaid/get_transactions?dateRange=${dateRage}`);
  const transactions = response.data.sort((a, b) => {
    return DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis();
  });
  return transactions;
}
