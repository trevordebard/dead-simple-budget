import { Button, ListRow } from 'components/Styled';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useGetTransactionsFromBank } from 'lib/hooks/transaction/useGetTransactionsFromBank';
import { useImportBankTransactions } from 'lib/hooks/transaction/useImportBankTransactions';
const List = styled.div`
  display: flex;
  flex-direction: column;
`;

export function Import() {
  const [fetchTrans, setFetchTrans] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const { data: transactions } = useGetTransactionsFromBank({ enabled: fetchTrans });
  const { mutate: uploadTransactions } = useImportBankTransactions();

  useEffect(() => {
    if (transactions) {
      const ids = [];
      transactions.forEach(transaction => {
        ids.push(transaction.transaction_id);
      });
      setSelectedTransactions(ids);
    }
  }, [transactions, setSelectedTransactions]);

  const handleImport = () => {
    setFetchTrans(true);
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
      <Button category="ACTION" onClick={handleUpload}>
        Import Selected
      </Button>
      <Button category="PRIMARY" onClick={() => setSelectedTransactions([])}>
        Unselect All
      </Button>
      <List>
        {transactions.map(transaction => {
          return (
            <ListRow
              key={transaction.transaction_id}
              selected={selectedTransactions.indexOf(transaction.transaction_id) !== -1}
              onClick={() => {
                const index = selectedTransactions.indexOf(transaction.transaction_id);
                if (index === -1) {
                  setSelectedTransactions([...selectedTransactions, transaction.transaction_id]);
                } else {
                  const selected = [...selectedTransactions];
                  selected.splice(index, 1);
                  setSelectedTransactions(selected);
                }
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={selectedTransactions.indexOf(transaction.transaction_id) !== -1}
                  onChange={() => {
                    //do nothing
                  }}
                />
                <p>{transaction.name}</p>
              </div>
              <span>
                <p>{transaction.amount}</p>
                <p>{transaction.pending ? 'Pending' : transaction.date}</p>
              </span>
            </ListRow>
          );
        })}
      </List>
    </div>
  );
}
