import { Button } from 'components/Styled';

import styled from 'styled-components';
import { useState } from 'react';
import { useGetTransactionsFromBank } from 'lib/hooks/transaction/useGetTransactionsFromBank';
import { useImportBankTransactions } from 'lib/hooks/transaction/useImportBankTransactions';
import { ListItem, MultiSelectList } from 'components/Shared/MultiSelectList';
import { TransactionCard } from '../TransactionCard';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export function Import() {
  const [fetchTrans, setFetchTrans] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const { data: transactions } = useGetTransactionsFromBank({ enabled: fetchTrans });
  const { mutate: uploadTransactions } = useImportBankTransactions();

  const handleImport = () => {
    setFetchTrans(true);
  };

  const handleTransactionSelected = (selectedId: string) => {
    let newArr = [];
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

  if (!transactions) {
    return (
      <div>
        <Button onClick={handleImport} category="TRANSPARENT">
          Import
        </Button>
      </div>
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
            <ListItem key={transaction.transaction_id} value={transaction.transaction_id}>
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
