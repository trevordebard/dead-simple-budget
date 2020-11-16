import { useState } from 'react';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import Link from 'next/link';
import useTransactions from '../hooks/useTransactions';
import { smBreakpoint } from '../lib/constants';

const ActionLink = styled.a`
  text-decoration: none;
  color: inherit;
  font-size: var(--smallFontSize);
  cursor: pointer;
  color: var(--fontColorLight);
`;

const theme = createMuiTheme({
  overrides: {
    MuiTable: {
      root: {
        overflowY: 'scroll',
      },
    },
    MuiTableCell: {
      sizeSmall: {
        padding: '6px 10px',
      },
    },
    MuiTableRow: {
      root: {
        '&:hover': {
          backgroundColor: 'var(--rowHover)',
        },
        '&$selected, &$selected:hover': {
          backgroundColor: 'var(--yellow)',
        },
      },
    },
  },
});

const TransactionWrapper = styled.div`
  max-width: 100%;
  max-height: 70vh;
  display: grid;
  grid-template-columns: 3fr auto;
  grid-auto-rows: min-content;
  grid-template-areas:
    'title'
    'table';
`;

const Title = styled.div`
  grid-area: title;
  text-align: center;
`;

const TableWrapper = styled(TableContainer)`
  grid-area: table;
  min-width: 450px;
  max-height: 80vh;
  margin-top: 1rem;
  @media only screen and (max-width: ${smBreakpoint}) {
    min-width: 350px;
    grid-template-columns: 1fr;
    max-height: 440px;
    th,
    td {
      padding: 0.2rem;
    }
  }
`;

const Transactions = () => {
  const { transactions, loading, deleteManyTransactions } = useTransactions();
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  if (!loading) {
    return (
      <TransactionWrapper>
        <Title>
          <h1>Transactions</h1>
          <div>
            {selectedTransactions.length === 0 && (
              <Link href="/transactions/new">
                <ActionLink>Add</ActionLink>
              </Link>
            )}
            {selectedTransactions.length === 1 && (
              <Link href={`/transactions/edit/${selectedTransactions[0]}`}>
                <ActionLink>Edit</ActionLink>
              </Link>
            )}
            {selectedTransactions.length > 1 && (
              <ActionLink
                as="div"
                role="button"
                onClick={() => {
                  deleteManyTransactions(selectedTransactions);
                  setSelectedTransactions([]);
                }}
              >
                Delete Selected
              </ActionLink>
            )}
          </div>
        </Title>
        <TableWrapper>
          <ThemeProvider theme={theme}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Stack</TableCell>
                  <TableCell sortDirection="desc" style={{ minWidth: '115px' }} align="right">
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions &&
                  transactions.map(transaction => (
                    <TableRow key={transaction.id} selected={selectedTransactions.includes(transaction.id)}>
                      <TableCell>
                        <input
                          key={transaction.id}
                          type="checkbox"
                          onChange={e => {
                            if (!e.target.checked) {
                              setSelectedTransactions(selectedTransactions.filter(item => item !== transaction.id));
                            } else {
                              setSelectedTransactions([...selectedTransactions, transaction.id]);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell align="right">${transaction.amount}</TableCell>
                      <TableCell align="right">{transaction.stack}</TableCell>
                      <TableCell align="right">
                        {new Date(transaction.date).toLocaleDateString() || '9999/9/9'}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ThemeProvider>
        </TableWrapper>
      </TransactionWrapper>
    );
  }
  return null;
};

export default Transactions;
