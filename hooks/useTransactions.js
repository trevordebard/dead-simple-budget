import { useQuery, useMutation } from '@apollo/client';
import { GET_TRANSACTIONS } from '../lib/queries/GET_TRANSACTIONS';
import { ADD_TRANSACTION } from '../lib/queries/ADD_TRANSACTION';

const useTransactions = () => {
  const { data, loading } = useQuery(GET_TRANSACTIONS);
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
  if (data?.me) {
    transactions = data.me.transactions;
  }
  return { loading, transactions, addTransaction };
};

export default useTransactions;
