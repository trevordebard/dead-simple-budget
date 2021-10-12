import { Transaction } from '.prisma/client';
import axios from 'axios';
import { useAlert } from 'components/Alert';
import { useMutation } from 'react-query';
import { iEditTransactionInput } from 'types/transactions';

export function useEditTransaction() {
  const { addAlert } = useAlert();
  return useMutation(editTransaction, {
    onError: () => {
      addAlert({ message: 'There was a problem editing transaction', type: 'error' });
    },
    onSuccess: () => {
      addAlert({ message: 'Transaction updated', type: 'success' });
    },
  });
}

interface params {
  transactionId: number;
  transactionInput: iEditTransactionInput;
}
async function editTransaction(transaction: params) {
  const response = await axios.put<Transaction>(
    `/api/transaction/${transaction.transactionId}`,
    transaction.transactionInput
  );
  return response.data;
}
