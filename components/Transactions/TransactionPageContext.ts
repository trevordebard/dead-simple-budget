import { createContext } from 'react';

// Setup Layout context
interface iTransactionPageContext {
  selectedTransactionIds: number[] | null;
  toggleSelectedTransaction: (transactionId: number) => void;
}

const defaultContext: iTransactionPageContext = {
  selectedTransactionIds: null,
  toggleSelectedTransaction: null,
};
const TransactionPageContext = createContext(defaultContext);
TransactionPageContext.displayName = 'TransactionPageContext';

export { TransactionPageContext };
