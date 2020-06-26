import React, { useState } from 'react';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from './Input';
import { HeaderOne, Button } from './styled';
import RequireLogin from './RequireLogin';
import useTransactions from '../hooks/useTransactions';
import NewTransaction from './NewTransaction';

const TransactionWrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
  text-align: center;
  table {
    min-width: 450px;
    height: 600px;
    th,
    td {
      font-size: 1.6rem;
      padding: 1rem;
    }
  }
  tr {
    &:hover {
      background-color: var(--green10);
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Stack</TableCell>
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
                  <TableCell>{transaction.stack}</TableCell>
                  <TableCell align="right">{new Date(transaction.date).toLocaleDateString() || '9999/9/9'}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TransactionWrapper>
    );
  }
  return <p>loading...</p>;
};
const Temp = () => {
  console.log('placeholder');
  return (
    <>
      <Input placeholder="Description" type="text" />
      <Input placeholder="Amount" type="text" />
      <Input placeholder="Date" type="text" />
      <Input placeholder="Submit" type="text" />
    </>
  );
};
export default RequireLogin(Transactions);
