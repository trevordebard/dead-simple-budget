import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_TRANSACTIONS } from '../graphql/queries/GET_TRANSACTIONS';
import { ADD_TRANSACTION } from '../graphql/queries/ADD_TRANSACTION';

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
  mutation($record: UpdateByIdTransactionInput!) {
    transactionUpdateById(record: $record) {
      record {
        _id
        amount
        stack
        description
        date
      }
    }
  }
`;

const useTransactions = () => {
  const { data, loading } = useQuery(GET_TRANSACTIONS);
  const { data: stackLabelData } = useQuery(GET_STACK_LABELS);

  const [editTransaction] = useMutation(EDIT_TRANSACTION);
  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    update: (cache, { data: resData }) => {
      const dataResult = cache.readQuery({ query: GET_TRANSACTIONS });
      cache.writeQuery({
        query: GET_TRANSACTIONS,
        data: {
          me: [...dataResult.me.transactions, resData.transactionCreateOne.record],
        },
      });
    },
  });
  let transactions;
  let stackLabels;

  if (data?.me) {
    transactions = data.me.transactions;
  }
  if (stackLabelData?.me) {
    stackLabels = stackLabelData.me.budget.stackLabels;
  }

  return { loading, transactions, addTransaction, stackLabels, editTransaction };
};

export default useTransactions;
