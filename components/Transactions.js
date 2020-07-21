import { useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import RequireLogin from './RequireLogin';
import useTransactions from '../hooks/useTransactions';
import NewTransaction from './NewTransaction';
import EditTransaction from './EditTransaction';
import { smBreakpoint } from '../lib/constants';
import Modal, { ModalCard } from './Modal';
import { ActionButton } from './styled';

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

const RowTools = styled.div`
  display: flex;
  justify-content: center;
  color: transparent;
  svg {
    cursor: pointer;
    :hover {
      color: var(--action);
    }
  }
`;

const TransactionWrapper = styled.div`
  max-width: 100%;
  max-height: 70vh;
  display: grid;
  grid-template-columns: 3fr auto;
  grid-auto-rows: min-content;
  grid-template-areas:
    'title .'
    'table actions';
  @media only screen and (max-width: ${smBreakpoint}) {
    grid-template-areas:
      'title'
      'actions'
      'table';
  }
`;

const Title = styled.div`
  grid-area: title;
  text-align: center;
`;

const Actions = styled.div`
  grid-area: actions;
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
  const { transactions, loading } = useTransactions();
  const [transactionInFocus, setTransactionInFocus] = useState();
  if (!loading) {
    return (
      <TransactionWrapper>
        <Title>
          <h1>Transactions</h1>
        </Title>
        <TableWrapper>
          <ThemeProvider theme={theme}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Stack</TableCell>
                  <TableCell sortDirection="desc" style={{ minWidth: '115px' }} align="right">
                    Date
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions &&
                  transactions.map(transaction => (
                    <TableRow key={transaction._id} selected={transaction._id === transactionInFocus}>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell align="right">${transaction.amount}</TableCell>
                      <TableCell align="right">{transaction.stack}</TableCell>
                      <TableCell align="right">
                        {new Date(transaction.date).toLocaleDateString() || '9999/9/9'}
                      </TableCell>
                      <TableCell style={{ padding: '0px' }}>
                        <RowTools>
                          <EditIcon
                            onClick={() => {
                              setTransactionInFocus(transaction._id);
                            }}
                          />
                        </RowTools>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ThemeProvider>
        </TableWrapper>
        <Actions>
          <TransactionActions transactionInFocus={transactionInFocus} setTransactionInFocus={setTransactionInFocus} />
        </Actions>
      </TransactionWrapper>
    );
  }
  return <p>loading...</p>;
};

const TransactionActions = ({ transactionInFocus, setTransactionInFocus }) => {
  const smScreen = useMediaQuery(`(max-width:${smBreakpoint})`);
  const [newTransactionInFocus, setNewTransactionInFocus] = useState(false);
  if (smScreen) {
    if (transactionInFocus) {
      return (
        <Modal visible={transactionInFocus || newTransactionInFocus} hide={() => setTransactionInFocus(null)}>
          <ModalCard>
            <EditTransaction transactionId={transactionInFocus} cancelEdit={() => setTransactionInFocus(null)} />
          </ModalCard>
        </Modal>
      );
    }
    if (!newTransactionInFocus) {
      return (
        <ActionButton type="button" onClick={() => setNewTransactionInFocus(true)}>
          Add Transaction
        </ActionButton>
      );
    }
    return (
      <Modal visible={newTransactionInFocus} hide={() => setNewTransactionInFocus(null)}>
        <ModalCard>
          <NewTransaction />
        </ModalCard>
      </Modal>
    );
  }
  if (transactionInFocus) {
    return <EditTransaction transactionId={transactionInFocus} cancelEdit={() => setTransactionInFocus(null)} />;
  }
  return <NewTransaction />;
};

export default RequireLogin(Transactions);
