import React from 'react';
import { useForm, ErrorMessage } from 'react-hook-form';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from './Input';
import { HeaderOne } from './styled';
import RequireLogin from './RequireLogin';
import useTransactions from '../hooks/useTransactions';
import { GET_TRANSACTIONS } from '../lib/queries/GET_TRANSACTIONS';

const TransactionWrapper = styled.div`
  width: 100%;
  table {
    min-width: 450px;
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
`;
const Transactions = () => {
  const { transactions, loading } = useTransactions();
  console.log(transactions);
  if (!loading) {
    return (
      <TransactionWrapper>
        <HeaderOne>Transactions</HeaderOne>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell style={{ minWidth: '115px' }} variant="head" align="right">
                Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions &&
              transactions.map(transaction => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right">${transaction.amount}</TableCell>
                  <TableCell align="right">Jan 01 9999</TableCell>
                </TableRow>
              ))}
            {transactions &&
              transactions.map(transaction => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right">${transaction.amount}</TableCell>
                  <TableCell align="right">Jan 01 9999</TableCell>
                </TableRow>
              ))}
            {transactions &&
              transactions.map(transaction => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right">${transaction.amount}</TableCell>
                  <TableCell align="right">Jan 01 9999</TableCell>
                </TableRow>
              ))}
            {transactions &&
              transactions.map(transaction => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right">${transaction.amount}</TableCell>
                  <TableCell align="right">Jan 01 9999</TableCell>
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
const NewTransaction = () => {
  const { register, handleSubmit, errors, reset } = useForm();
  const { addTransaction, stackLabels } = useTransactions();

  const onSubmit = data => {
    const { description, amount, stack } = data;
    addTransaction({
      variables: { record: { description, amount: parseFloat(amount), stack } },
      refetchQueries: { query: GET_TRANSACTIONS },
    });
    reset();
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="description">
          Description: <input name="description" defaultValue="" ref={register({ required: 'Required' })} />
          <ErrorMessage errors={errors} name="description">
            {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
          </ErrorMessage>
        </label>
        <label htmlFor="amount">
          Amount: <input name="amount" ref={register({ required: 'Required' })} />
          <ErrorMessage errors={errors} name="amount">
            {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
          </ErrorMessage>
        </label>
        <label htmlFor="date">
          Date: <input name="date" ref={register} />
        </label>
        <select name="stack" ref={register({ required: true })}>
          {stackLabels &&
            stackLabels.map(label => (
              <option key={`${label}-${Date.now()}`} value={label}>
                {label}
              </option>
            ))}
          <ErrorMessage errors={errors} name="stack">
            {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
          </ErrorMessage>
        </select>
        <input type="submit" />
      </form>
    </>
  );
};
export default RequireLogin(Transactions);
