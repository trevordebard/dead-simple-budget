import { Button, ListRow } from 'components/Styled';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Transaction as PlaidTransaction } from 'plaid';
import { useAlert } from 'components/Alert';
const List = styled.div`
  display: flex;
  flex-direction: column;
`;

async function fetchTransactions() {
  const response = await axios.get<PlaidTransaction[]>('/api/plaid/get_transactions');
  return response.data;
}

async function postTransactions(transactions: PlaidTransaction[]) {
  const response = await axios.post<PlaidTransaction[]>('/api/transactions', transactions);
  return response.data;
}

export function Import() {
  const [fetchTrans, setFetchTrans] = useState(false);
  const queryClient = useQueryClient();

  const { addAlert } = useAlert();
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const { data: transactions, isLoading } = useQuery('fetch-transactions-from-bank', fetchTransactions, {
    enabled: fetchTrans,
    staleTime: 10800000, // 3hr
  });

  const { mutate: uploadTransactions } = useMutation(postTransactions);

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
    uploadTransactions(selected, {
      onSuccess: () => {
        addAlert({ message: 'Success!', type: 'success' });
        queryClient.refetchQueries('fetch-transactions-from-bank');
      },
    });
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
        Save Selected
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
