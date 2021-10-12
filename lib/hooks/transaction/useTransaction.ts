import { useQuery } from 'react-query';
import axios from 'axios';
import { Transaction } from '.prisma/client';

export function useTransaction(transactionId: number) {
  return useQuery([`fetch-transaction-${transactionId}`, { transactionId }], fetchTransactionById);
}

async function fetchTransactionById({ queryKey }) {
  const [_, { transactionId }] = queryKey;
  const response = await axios.get<Transaction>(`/api/transaction/${transactionId}`);
  return response.data;
}
