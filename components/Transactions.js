import React from 'react';
import { useForm, ErrorMessage } from 'react-hook-form';
import { GET_TRANSACTIONS } from '../lib/queries/GET_TRANSACTIONS';
import useTransactions from '../hooks/useTransactions';
import RequireLogin from './RequireLogin';

const Transactions = () => {
  const { transactions, loading } = useTransactions();
  if (!loading) {
    return (
      <div>
        {transactions &&
          transactions.map(transaction => (
            <p key={`${transaction._id}`}>
              {transaction.description}:{transaction.amount}
            </p>
          ))}
        <NewTransaction />
      </div>
    );
  }
  return <p>loading...</p>;
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
