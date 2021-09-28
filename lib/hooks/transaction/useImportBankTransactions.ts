import { Transaction as PlaidTransaction } from 'plaid';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAlert } from 'components/Alert';

// This hook can be used to import transactions from a user's bank account
// to their Dead Simple Budget account
export function useImportBankTransactions() {
  const { addAlert } = useAlert();
  const queryClient = useQueryClient();

  return useMutation(importTransactions, {
    onSuccess: () => {
      addAlert({ message: 'Success!', type: 'success' });
      queryClient.refetchQueries('fetch-transactions-from-bank');
    },
  });
}

async function importTransactions(transactions: PlaidTransaction[]) {
  const response = await axios.post<PlaidTransaction[]>('/api/transactions', transactions);
  return response.data;
}
