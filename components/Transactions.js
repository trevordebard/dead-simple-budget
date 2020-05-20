import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useForm, ErrorMessage } from 'react-hook-form';
import useBudget from '../hooks/useBudget';

const ADD_TRANSACTION = gql`
  mutation($record: CreateOneTransactionInput!) {
    transactionCreateOne(record: $record) {
      record {
        description
        date
      }
    }
  }
`;

const Transactions = () => {
  const {
    state: { transactions },
  } = useBudget();
  return (
    <>
      <h1>Transactions</h1>
      {transactions.map(transaction => (
        <p key={`${transaction.description}-${transaction.amount}`}>
          {transaction.description}:{transaction.amount}
        </p>
      ))}
      <NewTransaction />
    </>
  );
};

const NewTransaction = () => {
  const { register, handleSubmit, errors, reset } = useForm();
  const { state } = useBudget();
  const [addTransaction] = useMutation(ADD_TRANSACTION);
  const onSubmit = data => {
    const { description, amount, stack } = data;
    addTransaction({
      variables: { record: { description, amount: parseFloat(amount), stack, _userId: state._userId } },
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
          {state.stacks.map(stackEl => (
            <option key={stackEl._id || `${stackEl.label}-${Date.now()}`} value={stackEl.label}>
              {stackEl.label}
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
export default Transactions;
