import { useSession } from 'next-auth/client';
import { fetchTransactions } from 'components/Transactions/queries/getTransactions';
import { useAlert } from 'components/Alert';
import { getStackLabels } from '../../lib/budgetUtils';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Transaction } from '.prisma/client';
import { editTransaction } from 'components/Transactions/mutations/editTransaction';
import { createTransaction } from './mutations/createTransaction';
import { deleteTransactions } from './mutations/deleteTransactions';
import { fetchStacks } from 'components/Budget/queries/getStacks';

const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stackLabels, setStackLabels] = useState<string[] | null>();
  const { addAlert } = useAlert();
  const { data, error: e, isLoading } = useQuery('fetch-transactions', fetchTransactions);
  // TODO: create a useStack hook that includes this logic
  const { data: stacksResponse } = useQuery('fetch-stacks', fetchStacks);
  const { mutate: editTransactionMutation } = useMutation(editTransaction);
  const { mutate: createTransactionMutation } = useMutation(createTransaction);
  const { mutate: deleteTransactionsMutation } = useMutation(deleteTransactions);

  useEffect(() => {
    if (data) {
      setTransactions(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (stacksResponse) {
      const labels = getStackLabels(stacksResponse.data);
      setStackLabels(labels);
    }
  }, [stacksResponse]);

  return {
    loading: isLoading,
    transactions,
    createTransaction: createTransactionMutation,
    stackLabels,
    editTransaction: editTransactionMutation,
    deleteManyTransactions: deleteTransactionsMutation,
  };
};

export default useTransactions;
