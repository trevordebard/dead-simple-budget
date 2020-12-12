import { useQuery, useMutation, gql, MutationHookOptions } from '@apollo/client';
import { useSession } from 'next-auth/client';
import { ADD_TRANSACTION } from './queries/ADD_TRANSACTION';
import { getStackLabels } from '../../lib/budgetUtils';
import { GET_TRANSACTIONS, EDIT_TRANSACTION, DELETE_MANY_TRANSACTIONS } from './queries';

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
  const { data, loading } = useQuery(GET_TRANSACTIONS, { variables: { email: session.user.email } });
  const { data: stackLabelRes } = useQuery(GET_STACK_LABELS, {
    variables: { email: session.user.email },
  });
  const [editTransactionM] = useMutation(EDIT_TRANSACTION);
  const [addTransactionM] = useMutation(ADD_TRANSACTION);
  const [deleteManyTransactionsM] = useMutation(DELETE_MANY_TRANSACTIONS, { refetchQueries: ['GET_TRANSACTIONS'] });
  let stackLabels;
  let transactions;
  function addTransaction(description, amount, stack, date, type, ...params) {
    addTransactionM({
      ...params,
      refetchQueries: ['GET_TRANSACTIONS'],
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
