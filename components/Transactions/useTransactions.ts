import { gql, MutationHookOptions } from '@apollo/client';
import { useSession } from 'next-auth/client';
import { useGetStackLabelsQuery } from 'graphql/generated/codegen';
import { fetchTransactions } from 'components/Transactions/queries/getTransactions';
import { useAlert } from 'components/Alert';
import { getStackLabels } from '../../lib/budgetUtils';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Transaction } from '.prisma/client';
import { editTransaction } from 'components/Transactions/mutations/editTransaction';
import { createTransaction } from './mutations/createTransaction';
import { deleteTransactions } from './mutations/deleteTransactions';

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
  const { data, error: e, isLoading } = useQuery('fetch-transactions', fetchTransactions);
  const { mutate: editTransactionMutation } = useMutation(editTransaction);
  const { mutate: createTransactionMutation } = useMutation(createTransaction);
  const { mutate: deleteTransactionsMutation } = useMutation(deleteTransactions);
  const { data: stackLabelRes } = useGetStackLabelsQuery({ variables: { email: session.user.email } });

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
