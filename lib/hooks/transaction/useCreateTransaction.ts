import { Transaction } from '.prisma/client';
import axios from 'axios';
import { useAlert } from 'components/Alert';
import { useMutation } from 'react-query';
import { iCreateTransactionInput } from 'types/transactions';

export function useCreateTransaction() {
  const { addAlert } = useAlert();
  return useMutation(createTransaction, {
    onError: () => {
      addAlert({ message: 'There was a problem adding transaction.', type: 'error' });
    },
    onSuccess: () => {
      addAlert({ message: 'Transaction added', type: 'success' });
    },
  });
}

interface params {
  transactionInput: iCreateTransactionInput;
}
async function createTransaction(transaction: params) {
  const response = await axios.post<Transaction>(`/api/transaction`, transaction.transactionInput);
  return response.data;
}
