import React from 'react';

import { useForm, ErrorMessage } from 'react-hook-form';
import styled from 'styled-components';
import { GET_TRANSACTIONS } from '../lib/queries/GET_TRANSACTIONS';
import useTransactions from '../hooks/useTransactions';
import { Button, HeaderFour } from './styled';

const NewtransactionWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  max-width: 60rem;
  input,
  select {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 0;
  }
  button {
    margin-top: 10px;
    height: 3rem;
  }
`;
const NewTransaction = () => {
  const { register, handleSubmit, errors, reset, getValues } = useForm();
  const { addTransaction, stackLabels } = useTransactions();

  const onSubmit = () => {
    const data = getValues();
    const { description, amount, stack, date } = data;
    reset();
    addTransaction({
      variables: { record: { description, amount: parseFloat(amount), stack, date } },
      refetchQueries: { query: GET_TRANSACTIONS },
    });
  };

  return (
    <NewtransactionWrapper onSubmit={handleSubmit(onSubmit)}>
      <HeaderFour>New Transaction</HeaderFour>
      <input
        name="description"
        defaultValue=""
        ref={register({ required: 'Required' })}
        type="text"
        placeholder="Description"
      />
      <input name="amount" ref={register({ required: 'Required' })} type="number" pattern="\d*" placeholder="Amount" />
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
      <input id="date" type="date" name="date" ref={register} />
      <Button isAction>Add</Button>
    </NewtransactionWrapper>
  );
};
export default NewTransaction;
