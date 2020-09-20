import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_TRANSACTIONS } from '../graphql/queries/GET_TRANSACTIONS';
import { ADD_TRANSACTION } from '../graphql/queries/ADD_TRANSACTION';
import { getStackLabels } from '../lib/budgetUtils';

const GET_STACK_LABELS = gql`
  query GET_STACK_LABELS {
    me {
      id
      budget {
        id
        stacks {
          label
        }
      }
    }
  }
`;
export const EDIT_TRANSACTION = gql`
  mutation EDIT_TRANSACTION(
    $id: Int!
    $amount: Float
    $stack: String
    $description: String
    $date: DateTime
    $type: String
  ) {
    updateOnetransactions(
      where: { id: $id }
      data: {
        description: { set: $description }
        stack: { set: $stack }
        amount: { set: $amount }
        type: { set: $type }
        date: { set: $date }
      }
    ) {
      id
      amount
      stack
      description
      date
    }
  }
`;

const useTransactions = () => {
  const { data, loading } = useQuery(GET_TRANSACTIONS);
  const { data: stackLabelData } = useQuery(GET_STACK_LABELS);

  const [editTransactionM] = useMutation(EDIT_TRANSACTION);
  const [addTransactionM] = useMutation(ADD_TRANSACTION);
  let transactions;
  let stackLabels;
  function addTransaction(description, amount, stack, date, type, ...params) {
    addTransactionM({
      ...params,
      variables: { email: data.me.email, description, amount, stack, date: new Date(date).toISOString(), type },
    });
  }
  function editTransaction(id, description, amount, stack, date, type, ...params) {
    editTransactionM({
      ...params,
      variables: { id, description, amount, stack, date: new Date(date).toISOString(), type },
    });
  }
  if (data?.me) {
    transactions = data.me.transactions;
  }
  if (stackLabelData?.me) {
    stackLabels = getStackLabels(stackLabelData.me.budget[0]);
  }

  return { loading, transactions, addTransaction, stackLabels, editTransaction };
};

export default useTransactions;
