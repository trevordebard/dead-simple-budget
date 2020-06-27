import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { HeaderOne, Button } from './styled';
import RequireLogin from './RequireLogin';
import useTransactions from '../hooks/useTransactions';
import NewTransaction from './NewTransaction';

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
  max-width: 100vw;
  overflow-y: scroll;
  text-align: center;
  max-height: 70vh;
  @media only screen and (max-width: 600px) {
    width: 100vw;
    th,
    td {
      padding: 0.2rem;
    }
  }
  table {
    max-width: 100vw;
    th,
    td {
      font-size: 1.4rem;
    }
  }
  tr {
    &:hover {
      background-color: var(--green10);
      ${RowTools} {
        color: var(--fontColor60);
      }
    }
  }
  h1 {
    text-align: center;
  }
  input,
  select {
    padding: 5px;
    font-size: 1.6rem;
  }
`;
const Transactions = () => {
  const { transactions, loading } = useTransactions();
  const [edit, setEdit] = useState(false);
  if (!loading) {
    return (
      <TransactionWrapper>
        <HeaderOne>Transactions</HeaderOne>
        <Button onClick={() => setEdit(!edit)} primary>
          +
        </Button>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Stack</TableCell>
              <TableCell style={{ minWidth: '115px' }} variant="head" align="right">
                Date
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {edit && <NewTransaction />}
            {transactions &&
              transactions.map(transaction => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right">${transaction.amount}</TableCell>
                  <TableCell align="right">{transaction.stack}</TableCell>
                  <TableCell align="right">{new Date(transaction.date).toLocaleDateString() || '9999/9/9'}</TableCell>
                  <TableCell style={{ padding: '0px' }}>
                    <RowTools>
                      <EditIcon />
                      <DeleteIcon />
                    </RowTools>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TransactionWrapper>
    );
  }
  return <p>loading...</p>;
};

export default RequireLogin(Transactions);
