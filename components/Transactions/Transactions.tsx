import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useDeleteTransactions, useTransactions } from 'lib/hooks';
import { smBreakpoint } from '../../lib/constants';
import { useQueryClient } from 'react-query';
import { DateTime } from 'luxon';
import { TransactionCard } from './TransactionCard';
import { ListItem, MultiSelectList } from 'components/Shared/MultiSelectList';
import { centsToDollars } from 'lib/money';

const TransactionWrapper = styled.div`
  max-width: 100%;
`;

const Title = styled.div`
  text-align: center;
  max-width: 500px;
`;

const TableWrapper = styled.div`
  max-height: 600px;
  font-size: 13px;
  overflow-y: scroll;

  @media only screen and (max-width: ${smBreakpoint}) {
    max-width: 90vw;
  }
`;

const Actions = styled.div`
  a + a::before {
    content: ' | ';
  }
`;
const ActionLink = styled.a`
  text-decoration: none;
  color: inherit;
  font-size: var(--smallFontSize);
  cursor: pointer;
  color: var(--fontColorLight);
`;

const Transactions = () => {
  const { data: transactions, isLoading } = useTransactions();
  const { mutate: deleteTransactions } = useDeleteTransactions();
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const handleTransactionSelected = (selectedId: number) => {
    let newArr = [];
    const index = selectedTransactions.indexOf(selectedId);
    if (index === -1) {
      newArr = [...selectedTransactions, selectedId];
    } else {
      newArr = selectedTransactions.filter(i => i !== selectedId);
    }
    setSelectedTransactions(newArr);
  };

  if (isLoading)
    return (
      <TransactionWrapper>
        <Title>
          <h3>One moment. Retrieving your latest transactions.</h3>
        </Title>
      </TransactionWrapper>
    );
  if (!isLoading) {
    return (
      <TransactionWrapper>
        <Title>
          <h1>Transactions</h1>
          <Actions>
            {selectedTransactions.length === 0 && (
              <Link href="/transactions/new" passHref>
                <ActionLink>Add</ActionLink>
              </Link>
            )}
            {selectedTransactions.length === 1 && (
              <Link passHref href={`/transactions/edit/${selectedTransactions[0]}`}>
                <ActionLink>Edit</ActionLink>
              </Link>
            )}
            <Link href="/import" passHref>
              <ActionLink>Import</ActionLink>
            </Link>
            {selectedTransactions.length > 0 && (
              <ActionLink
                role="button"
                onClick={() => {
                  deleteTransactions(
                    { transactionIds: selectedTransactions },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries('fetch-transactions');
                      },
                    }
                  );
                  setSelectedTransactions([]);
                }}
              >
                Delete {selectedTransactions.length > 1 && 'Selected'}
              </ActionLink>
            )}
          </Actions>
        </Title>
        <MultiSelectList onItemSelected={selected => handleTransactionSelected(Number(selected))}>
          {transactions &&
            transactions.map(transaction => (
              <ListItem key={transaction.id} value={transaction.id.toString()}>
                <TransactionCard
                  description={transaction.description}
                  amount={parseFloat(centsToDollars(transaction.amount))}
                  date={DateTime.fromISO(transaction.date).toLocaleString()}
                  stack={transaction.stack}
                  isActive={selectedTransactions.includes(transaction.id)}
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
