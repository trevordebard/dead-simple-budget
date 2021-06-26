import { fetchTransactions } from 'components/Transactions/queries/getTransactions';
import { useAlert } from 'components/Alert';
import { getStackLabels } from '../../lib/budgetUtils';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { editTransaction } from 'components/Transactions/mutations/editTransaction';
import { createTransaction } from './mutations/createTransaction';
import { deleteTransactions } from './mutations/deleteTransactions';
import { fetchStacks } from 'components/Budget/queries/getStacks';

const useTransactions = () => {
  const [stackLabels, setStackLabels] = useState<string[] | null>();
  const { addAlert } = useAlert();
  const {
    data: transactionsResponse,
    error: e,
    isLoading,
  } = useQuery('fetch-transactions', fetchTransactions, { staleTime: 500000 });
  // TODO: create a useStack hook that includes this logic
  const { data: stacks } = useQuery('fetch-stacks-from-usetransaction', fetchStacks);
  const { mutate: editTransactionMutation } = useMutation(editTransaction, {
    onError: () => {
      addAlert({ message: 'There was a problem editing transaction', type: 'error' });
    },
    onSuccess: () => {
      addAlert({ message: 'Transaction updated', type: 'success' });
    },
  });
  const { mutate: createTransactionMutation } = useMutation(createTransaction, {
    onError: () => {
      addAlert({ message: 'There was a problem adding transaction.', type: 'error' });
    },
    onSuccess: () => {
      addAlert({ message: 'Transaction added', type: 'success' });
    },
  });
  const { mutate: deleteTransactionsMutation } = useMutation(deleteTransactions);

  useEffect(() => {
    if (stacks) {
      const labels = getStackLabels(stacks);
      setStackLabels(labels);
    }
  }, [stacks]);

  return {
    loading: isLoading && !transactionsResponse?.data,
    transactions: transactionsResponse?.data,
    createTransaction: createTransactionMutation,
    stackLabels,
    error: e,
    editTransaction: editTransactionMutation,
    deleteManyTransactions: deleteTransactionsMutation,
  };
};

export default useTransactions;
