import { useMutation } from 'react-query';
import { Transaction } from '.prisma/client';
import axios from 'axios';
import { iDeleteTransactionsInput } from 'types/transactions';
import { useAlert } from 'components/Alert';

export function useDeleteTransactions() {
  const { addAlert } = useAlert();
  return useMutation(deleteTransactions, {
    onError: () => {
      addAlert({ message: 'There was a problem deleting transaction.', type: 'error' });
    },
  });
}

async function deleteTransactions(transactionIds: iDeleteTransactionsInput) {
  const response = await axios.delete<Transaction>(`/api/transactions`, { data: transactionIds });
  return response;
}

export { deleteTransactions };
