import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useForm, ErrorMessage } from 'react-hook-form';
import { ADD_TRANSACTION } from '../lib/queries/ADD_TRANSACTION';
import { GET_TRANSACTIONS } from '../lib/queries/GET_TRANSACTIONS';

const Transactions = () => {
  const { data, loading, client } = useQuery(GET_TRANSACTIONS);
  console.log(data);
  if (!loading) {
    const { transactionMany: transactions } = data;
    return (
      <>
        <h1>Transactions</h1>
        {transactions.map(transaction => (
          <p key={`${transaction.description}-${transaction.amount}`}>
            {transaction.description}:{transaction.amount}
          </p>
        ))}
        <NewTransaction user={data._userId} />
      </>
    );
  }
  return <p>loading...</p>;
};

const NewTransaction = () => {
  const { register, handleSubmit, errors, reset } = useForm();
  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    update: (cache, { data }) => {
      const dataResult = cache.readQuery({ query: GET_TRANSACTIONS });
      cache.writeQuery({
        query: GET_TRANSACTIONS,
        data: {
          transactionMany: [...dataResult.transactionMany, data.transactionCreateOne.record],
        },
      });
    },
  });
  const onSubmit = data => {
    const { description, amount, stack } = data;
    addTransaction({
      variables: { record: { description, amount: parseFloat(amount), stack, _userId: '5ec1d97edd768b5259f24b50' } },
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
        <select name="stack" ref={register}>
          <option value="Eating Out">Eating Out</option>
          <option value="Rent">Rent</option>
        </select>
        {/* <select name="stack" ref={register({ required: true })}>
          {state.stacks.map(stackEl => (
            <option key={stackEl._id || `${stackEl.label}-${Date.now()}`} value={stackEl.label}>
              {stackEl.label}
            </option>
          ))}
          <ErrorMessage errors={errors} name="stack">
            {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
          </ErrorMessage>
        </select> */}
        <input type="submit" />
      </form>
    </>
  );
};
export default Transactions;
