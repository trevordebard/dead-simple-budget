import { Button, Select, SimpleFormWrapper } from 'components/Styled';

import styled from 'styled-components';
import { useState } from 'react';
import { useGetTransactionsFromBank } from 'lib/hooks/transaction/useGetTransactionsFromBank';
import { useImportBankTransactions } from 'lib/hooks/transaction/useImportBankTransactions';
import { ListItem, MultiSelectList } from 'components/Shared/MultiSelectList';
import { TransactionCard } from '../TransactionCard';
import { useForm } from 'react-hook-form';
import { StackDropdown } from 'components/Stack';
import { smBreakpoint } from 'lib/constants';

const Actions = styled.div`
  text-align: center;
  display: flex;
  button + button::before {
    content: ' | ';
    margin-left: 5px;
  }
  button {
    padding: 0;
    color: var(--grey-700);
  }
`;

const StackDropdownWrapper = styled.div`
  color: var(--grey-700);
  margin-bottom: 10px;
`;

const Title = styled.div`
  text-align: center;
  max-width: 500px;
  margin-bottom: 10px;
  @media only screen and (max-width: ${smBreakpoint}) {
    font-size: 0.9rem;
  }
`;

const ImportedTransactions = styled.div`
  overflow-y: scroll;

  @media only screen and (max-width: ${smBreakpoint}) {
    max-height: 50vh;
  }
`;

export function Import() {
  const [fetchTrans, setFetchTrans] = useState(false);
  const [dateRange, setDateRange] = useState<string>('30');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [selectedStack, setSelectedStack] = useState<string | null>('Imported');
  const { data: transactions } = useGetTransactionsFromBank({ enabled: fetchTrans, queryKey: dateRange });

  const { mutate: uploadTransactions } = useImportBankTransactions();

  const { register, handleSubmit } = useForm();

  const handleTransactionSelected = (selectedId: string) => {
    let newArr = [];

    // If transaction is pending, null will be returned as the value on click
    if (!selectedId) {
      return;
    }
    const index = selectedTransactions.indexOf(selectedId);
    if (index === -1) {
      newArr = [...selectedTransactions, selectedId];
    } else {
      newArr = selectedTransactions.filter(i => i !== selectedId);
    }
    setSelectedTransactions(newArr);
  };

  const handleUpload = () => {
    const filtered = transactions.filter(
      transaction => selectedTransactions.indexOf(transaction.transaction_id) !== -1
    );
    const transactionsToUpload = [];
    const selected = filtered.forEach(transaction => {
      //Check if stack is selected then add it
      if (selectedTransactions.indexOf(transaction.transaction_id) !== -1) {
        transactionsToUpload.push({ ...transaction, stack: selectedStack });
      }
    });
    uploadTransactions({ transactions: transactionsToUpload, stack: selectedStack });
  };

  const handleSubmitRange = payload => {
    setDateRange(payload['date-range']);
    setFetchTrans(true);
  };

  if (!transactions) {
    return (
      <SimpleFormWrapper onSubmit={handleSubmit(handleSubmitRange)}>
        <label htmlFor="date-range">Date Range</label>
        <Select name="date-range" defaultValue={dateRange} {...register('date-range', { required: true })}>
          <option value="30">30 Days</option>
          <option value="60">60 Days</option>
          <option value="120">120 Days</option>
        </Select>
        <Button type="submit" category="ACTION">
          Import
        </Button>
      </SimpleFormWrapper>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <Title>
        <h2 style={{ textAlign: 'center' }}>Import Transactions</h2>
      </Title>
      <StackDropdownWrapper>
        <p>Choose Stack (optional)</p>
        <StackDropdown defaultStack="Imported" onSelect={value => setSelectedStack(value)} />
      </StackDropdownWrapper>
      <Actions>
        <Button
          category="TRANSPARENT"
          onClick={() => {
            const transactionIds = transactions.map(transaction => {
              if (!transaction.pending) {
                return transaction.transaction_id;
              }
            });
            setSelectedTransactions(transactionIds);
          }}
        >
          Select All{'    '}
        </Button>
        <Button
          category="TRANSPARENT"
          onClick={() => {
            setSelectedTransactions([]);
          }}
        >
          Unselect All
        </Button>
      </Actions>
      <ImportedTransactions>
        <MultiSelectList
          onItemSelected={value => {
            handleTransactionSelected(value);
          }}
        >
          {transactions.map(transaction => {
            return (
              <ListItem
                key={transaction.transaction_id}
                value={transaction.pending ? null : transaction.transaction_id}
              >
                <TransactionCard
                  date={transaction.pending ? 'Pending' : transaction.date}
                  amount={transaction.amount * -1}
                  description={transaction.name}
                  stack=" "
                  key={transaction.transaction_id}
                  isActive={selectedTransactions.includes(transaction.transaction_id)}
                />
              </ListItem>
            );
          })}
        </MultiSelectList>
      </ImportedTransactions>
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <Button
          style={{ marginTop: '10px' }}
          disabled={selectedTransactions.length === 0}
          category="ACTION"
          onClick={handleUpload}
        >
          Save Selected
        </Button>
      </div>
    </div>
  );
}
