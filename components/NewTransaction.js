import React from 'react';

import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { GET_TRANSACTIONS } from '../lib/queries/GET_TRANSACTIONS';
import useTransactions from '../hooks/useTransactions';
import { Button } from './styled';
import Input from './FormInput';
import { formatDate } from '../lib/formatDate';

const NewtransactionWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  max-width: 60rem;
  input,
  select {
    margin-top: 1em;
    padding: 0.5rem;
    border-radius: 0;
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
      <h4>New Transaction</h4>
      <Input name="description" errors={errors} register={register} required type="text" placeholder="Description" />
      <Input
        name="amount"
        errors={errors}
        register={register}
        type="number"
        pattern="\d*"
        placeholder="Amount"
        required
      />
      <Input component="select" name="stack" defaultValue="" register={register} errors={errors} required>
        <option style={{ color: 'green' }} disabled name="select" value="">
          Select Stack
        </option>
        {stackLabels &&
          stackLabels.map(label => (
            <option key={`${label}-${Date.now()}`} value={label}>
              {label}
            </option>
          ))}
        }
      </Input>
      <Input
        name="date"
        errors={errors}
        register={register}
        type="date"
        defaultValue={formatDate(new Date())}
        required
      />
      <Button isAction>Add</Button>
    </NewtransactionWrapper>
  );
};
export default NewTransaction;
