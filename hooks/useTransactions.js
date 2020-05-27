import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from '../lib/queries/GET_TRANSACTIONS';

const useTransactions = () => {
  const { data, loading } = useQuery(GET_TRANSACTIONS);
  let transactions;
  if (data?.me) {
    transactions = data.me.transactions;
  }
  return { loading, transactions };
};

export default useTransactions;
