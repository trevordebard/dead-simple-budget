import { TransactionPageContext } from 'components/Transactions';
import { useContext } from 'react';

export function useTransactionPageContext() {
  const context = useContext(TransactionPageContext);
  return context;
}
