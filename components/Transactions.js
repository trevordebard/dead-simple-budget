import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useForm } from 'react-hook-form';
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
  const { register, handleSubmit, watch, errors } = useForm();
  const { state } = useBudget();
  const [addTransaction] = useMutation(ADD_TRANSACTION);

  const onSubmit = data => {
    const { description, amount, stack } = data;
    addTransaction({
      variables: { record: { description, amount: parseFloat(amount), stack, _userId: state._userId } },
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        Description: <input name="description" defaultValue="" ref={register} />
        Amount: <input name="amount" ref={register} />
        Date: <input name="date" ref={register} />
        <select name="stack" ref={register}>
          {state.stacks.map(stackEl => (
            <option key={stackEl._id || `${stackEl.label}-${Date.now()}`} value={stackEl.label}>
              {stackEl.label}
            </option>
          ))}
        </select>
        <input type="submit" />
      </form>
    </>
  );
};
export default Transactions;
