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
import { getStackLabels } from '../../lib/budgetUtils';

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
  });
  const [deleteManyTransactionsM] = useDeleteManyTransactionMutation({
    refetchQueries: ['getTransactions'],
    onError: e => {
      addAlert({ message: 'There was a problem deleting transactions.', type: 'error' });
    },
  });
  let stackLabels;
  let transactions;
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
      variables: { id, description, amount, stack, date: new Date(date).toISOString(), type },
    });
  }
  function deleteManyTransactions(transactionIds: number[], params?: MutationHookOptions) {
    deleteManyTransactionsM({
      ...params,
      variables: { transactionIds },
    });
  }
  if (data) {
    transactions = data.transactions;
  }
  if (stackLabelRes) {
    stackLabels = getStackLabels(stackLabelRes.user.budget);
  }

  return { loading, transactions, addTransaction, stackLabels, editTransaction, deleteManyTransactions };
};

export default useTransactions;
