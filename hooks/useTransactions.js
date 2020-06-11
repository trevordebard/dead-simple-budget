import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_TRANSACTIONS } from '../lib/queries/GET_TRANSACTIONS';
import { ADD_TRANSACTION } from '../lib/queries/ADD_TRANSACTION';

const GET_STACK_LABELS = gql`
  query GET_STACK_LABELS {
    me {
      _id
      budget {
        _id
        stackLabels
        stacks {
          label
        }
      }
    }
  }
`;

const useTransactions = () => {
  const { data, loading } = useQuery(GET_TRANSACTIONS);
  const { data: stackLabelData } = useQuery(GET_STACK_LABELS);
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

  return { loading, transactions, addTransaction, stackLabels };
};

export default useTransactions;
