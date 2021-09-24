import { Button, ListRow } from 'components/Styled';
import { useQuery } from 'react-query';
import axios from 'axios';

import styled from 'styled-components';
import { useState } from 'react';
import { Transaction as PlaidTransaction } from 'plaid';
const List = styled.div`
  display: flex;
  flex-direction: column;
`;

async function fetchTransactions() {
  const response = await axios.get<PlaidTransaction[]>('/api/plaid/get_transactions');
  return response.data;
}

export function Import() {
  const [fetchTrans, setFetchTrans] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const { data: transactions, isLoading } = useQuery('fetch-transactions', fetchTransactions, {
    enabled: fetchTrans,
    staleTime: 10800000, // 3hr
  });
  const handleImport = () => {
    console.log('import');
    setFetchTrans(true);
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
      <List>
        {transactions.map(transaction => (
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
              <input type="checkbox" checked={selectedTransactions.indexOf(transaction.transaction_id) !== -1} />
              <p>{transaction.name}</p>
            </div>
            <span>
              <p>{transaction.amount}</p>
              <p>{transaction.pending ? 'Pending' : transaction.date}</p>
            </span>
          </ListRow>
        ))}
      </List>
    </div>
  );
}
