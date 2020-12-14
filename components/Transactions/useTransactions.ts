import { gql, MutationHookOptions } from '@apollo/client';
import { useSession } from 'next-auth/client';
import {
  useAddTransactionMutation,
  useDeleteManyTransactionMutation,
  useEditTransactionMutation,
  useGetStackLabelsQuery,
  useGetTransactionsQuery,
} from 'graphql/generated/codegen';
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
  const { data, loading } = useGetTransactionsQuery({ variables: { email: session.user.email } });
  const { data: stackLabelRes } = useGetStackLabelsQuery({ variables: { email: session.user.email } });
  const [editTransactionM] = useEditTransactionMutation({ refetchQueries: ['getTransactions'] });
  const [addTransactionM] = useAddTransactionMutation({ refetchQueries: ['getTransactions'] });
  const [deleteManyTransactionsM] = useDeleteManyTransactionMutation({ refetchQueries: ['getTransactions'] });
  let stackLabels;
  let transactions;
  function addTransaction(description, amount, stack, date, type, ...params) {
    addTransactionM({
      ...params,
      refetchQueries: ['getTransaction'],
      variables: { email: session.user.email, description, amount, stack, date: new Date(date).toISOString(), type },
    });
  }
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
