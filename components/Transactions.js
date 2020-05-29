import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useForm, ErrorMessage } from 'react-hook-form';
import { GET_TRANSACTIONS } from '../lib/queries/GET_TRANSACTIONS';
import useTransactions from '../hooks/useTransactions';

const Transactions = () => {
  const { transactions, loading } = useTransactions();
  if (!loading) {
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
  }
  return <p>loading...</p>;
};

// TODO: There has to be a better way to get stack labels.
// maybe when authentication is set up this will be easier?
// maybe add a type policy to user with custom field "stackLabels" ??
const GET_STACK_LABELS = gql`
  query GET_STACK_LABELS {
    userById(_id: "5ec1d97edd768b5259f24b50") {
      budget {
        stacks {
          _id
          label
        }
      }
    }
  }
`;

const NewTransaction = () => {
  const { register, handleSubmit, errors, reset } = useForm();
  const { data: userData, loading: userDataLoading } = useQuery(GET_STACK_LABELS);
  const { addTransaction } = useTransactions();
  const labels = [];

  // TODO: find a better way to get labels to prevent multiple calls to this on submit
  if (!userDataLoading) {
    console.log('not loading called');
    userData.userById.budget.stacks.forEach(({ label }) => labels.push(label));
  }
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
          {labels.map(label => (
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
export default Transactions;
