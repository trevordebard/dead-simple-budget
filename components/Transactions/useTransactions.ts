import { gql, MutationHookOptions } from '@apollo/client';
import { useSession } from 'next-auth/client';
import {
  useAddTransactionMutation,
  useDeleteManyTransactionMutation,
  useEditTransactionMutation,
  useGetStackLabelsQuery,
  useGetTransactionsQuery,
} from 'graphql/generated/codegen';
import { useAlert } from 'components/Alert';
import moment from 'moment';
import { getStackLabels } from '../../lib/budgetUtils';
import { useEffect, useState } from 'react';

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

interface iUITransaction {
  id: string | number;
  description: string;
  stack: string;
  amount: number;
  type: string;
  date: Date;
  userId?: string;
}

const useTransactions = () => {
  const [transactions, setTransactions] = useState<iUITransaction[]>([]);
  const [stackLabels, setStackLabels] = useState<string[] | null>();
  const [session] = useSession();
  const { addAlert } = useAlert();
  const { data, loading } = useGetTransactionsQuery({ variables: { email: session.user.email } });
  const { data: stackLabelRes } = useGetStackLabelsQuery({ variables: { email: session.user.email } });
  const [editTransactionM] = useEditTransactionMutation({
    refetchQueries: ['getTransactions'],
    onError: e => {
      addAlert({ message: 'There was a problem editing transaction.', type: 'error' });
    },
  });
  const [addTransaction] = useAddTransactionMutation({
    refetchQueries: ['getTransactions'],
    onError: e => {
      addAlert({ message: 'There was a problem adding transaction.', type: 'error' });
    },
    onCompleted: () => addAlert({ message: 'Success!', type: 'success', duration: 2 }),
  });
  const [deleteManyTransactionsM] = useDeleteManyTransactionMutation({
    refetchQueries: ['getTransactions'],
    onError: e => {
      addAlert({ message: 'There was a problem deleting transactions.', type: 'error' });
    },
    onCompleted: () => addAlert({ message: 'Delete successful!', type: 'success' }),
  });
  useEffect(() => {
    if (data) {
      setTransactions(data.transactions);
    }
  }, [data]);
  useEffect(() => {
    if (stackLabelRes) {
      const labels = getStackLabels(stackLabelRes.user.budget);
      setStackLabels(labels);
    }
  }, [stackLabelRes]);
  function editTransaction(
    id: number,
    description: string,
    amount: number,
    stack: string,
    date: Date,
    type: string,
    params: MutationHookOptions
  ) {
    editTransactionM({
      ...params,
      variables: { id, description, amount, stack, date: moment(date), type },
    });
  }
  function deleteManyTransactions(transactionIds: number[], params?: MutationHookOptions) {
    deleteManyTransactionsM({
      ...params,
      variables: { transactionIds },
    });
  }

  return { loading, transactions, addTransaction, stackLabels, editTransaction, deleteManyTransactions };
};

export default useTransactions;
