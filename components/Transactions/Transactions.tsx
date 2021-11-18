import styled from 'styled-components';
import { DateTime } from 'luxon';
import { TransactionCard } from './TransactionCard';
import { ListItem, MultiSelectList } from 'components/Shared/MultiSelectList';
import { centsToDollars } from 'lib/money';
import { useTransactionPageContext } from 'lib/hooks/transaction/useTransactionPageContext';
import { useTransactions } from 'lib/hooks';

const TransactionWrapper = styled.div`
  max-width: 100%;
`;

const Transactions = () => {
  const { data: transactions, isLoading } = useTransactions();
  const { selectedTransactionIds, toggleSelectedTransaction } = useTransactionPageContext();

  const handleTransactionSelected = (selectedId: number) => {
    toggleSelectedTransaction(selectedId);
  };

  if (isLoading)
    return (
      <TransactionWrapper>
        <h3>One moment. Retrieving your latest transactions.</h3>
      </TransactionWrapper>
    );
  if (!isLoading) {
    return (
      <TransactionWrapper>
        <MultiSelectList onItemSelected={selected => handleTransactionSelected(Number(selected))}>
          {transactions &&
            transactions.map(transaction => (
              <ListItem key={transaction.id} value={transaction.id.toString()}>
                <TransactionCard
                  description={transaction.description}
                  amount={parseFloat(centsToDollars(transaction.amount))}
                  date={DateTime.fromISO(transaction.date).toLocaleString()}
                  stack={transaction.stack}
                  isActive={selectedTransactionIds.includes(transaction.id)}
                />
              </ListItem>
            ))}
        </MultiSelectList>
      </TransactionWrapper>
    );
  }
  return null;
};

export default Transactions;
