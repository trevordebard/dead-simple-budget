import { Button, Select, SimpleFormWrapper } from 'components/Styled';

import styled from 'styled-components';
import { useState } from 'react';
import { useGetTransactionsFromBank } from 'lib/hooks/transaction/useGetTransactionsFromBank';
import { useImportBankTransactions } from 'lib/hooks/transaction/useImportBankTransactions';
import { ListItem, MultiSelectList } from 'components/Shared/MultiSelectList';
import { TransactionCard } from '../TransactionCard';
import { useForm } from 'react-hook-form';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export function Import() {
  const [fetchTrans, setFetchTrans] = useState(false);
  const [dateRange, setDateRange] = useState<string>('30');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
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
    const selected = transactions.filter(
      transaction => selectedTransactions.indexOf(transaction.transaction_id) !== -1
    );
    uploadTransactions(selected);
  };

  const handleSubmitRange = payload => {
    console.log(payload);
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
      <ButtonContainer>
        <Button category="ACTION" onClick={handleUpload}>
          Import Selected
        </Button>
        <Button
          category="PRIMARY"
          onClick={() => {
            console.log(selectedTransactions);
            setSelectedTransactions([]);
          }}
        >
          Unselect All
        </Button>
      </ButtonContainer>
      <MultiSelectList
        onItemSelected={value => {
          handleTransactionSelected(value);
        }}
      >
        {transactions.map(transaction => {
          return (
            <ListItem key={transaction.transaction_id} value={transaction.pending ? null : transaction.transaction_id}>
              <TransactionCard
                date={transaction.pending ? 'Pending' : transaction.date}
                amount={transaction.amount * -1}
                description={transaction.name}
                key={transaction.transaction_id}
                isActive={selectedTransactions.includes(transaction.transaction_id)}
              />
            </ListItem>
          );
        })}
      </MultiSelectList>
    </div>
  );
}
