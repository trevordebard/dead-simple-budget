import { gql, MutationHookOptions } from '@apollo/client';
import { useSession } from 'next-auth/client';
import {
  useAddTransactionMutation,
  useDeleteManyTransactionMutation,
  useGetStackLabelsQuery,
} from 'graphql/generated/codegen';
import { fetchTransactions } from 'components/Transactions/queries/getTransactions';
import { useAlert } from 'components/Alert';
import { getStackLabels } from '../../lib/budgetUtils';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Transaction } from '.prisma/client';
import { editTransaction } from 'components/Transactions/mutations/editTransaction';
import { createTransaction } from './mutations/createTransaction';

const GET_STACK_LABELS = gql`
  query getStackLabels($email: String!) {
    user(where: { email: $email }) {
      id
      budget {
        stacks {
          label
        }
      }
    }
  }
`;

const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stackLabels, setStackLabels] = useState<string[] | null>();
  const [session] = useSession();
  const { addAlert } = useAlert();
  const { data, error: e, isLoading } = useQuery('transactions', fetchTransactions);
  const { mutate: editTransactionMutation } = useMutation(editTransaction);
  const { mutate: createTransactionMutation } = useMutation(createTransaction);
  const { data: stackLabelRes } = useGetStackLabelsQuery({ variables: { email: session.user.email } });

  const [deleteManyTransactionsM] = useDeleteManyTransactionMutation({
    refetchQueries: ['getTransactions'],
    onError: e => {
      addAlert({ message: 'There was a problem deleting transactions.', type: 'error' });
    },
    onCompleted: () => addAlert({ message: 'Delete successful!', type: 'success' }),
  });
  useEffect(() => {
    if (data) {
      setTransactions(data.data);
    }
  }, [data]);
  useEffect(() => {
    if (stackLabelRes) {
      const labels = getStackLabels(stackLabelRes.user.budget);
      setStackLabels(labels);
    }
  }, [stackLabelRes]);

  function deleteManyTransactions(transactionIds: number[], params?: MutationHookOptions) {
    deleteManyTransactionsM({
      ...params,
      variables: { transactionIds },
    });
  }

  return {
    loading: isLoading,
    transactions,
    createTransaction: createTransactionMutation,
    stackLabels,
    editTransaction: editTransactionMutation,
    deleteManyTransactions,
  };
};

export default useTransactions;
