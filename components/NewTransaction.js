import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useState } from 'react';
import { GET_TRANSACTIONS } from '../lib/queries/GET_TRANSACTIONS';
import useTransactions from '../hooks/useTransactions';
import { ActionButton } from './styled';
import FormInput, { FormSelect } from './FormInput';
import { formatDate } from '../lib/formatDate';

const NewtransactionWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1em;
  max-width: 60rem;

  > * {
    margin-bottom: 10px;
  }
`;

const TransactionTypeWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const RadioButton = styled.button`
  background: ${props => (props.active ? 'var(--neutralHover)' : 'transparent')};
  border: 1px solid ${props => (props.active ? 'var(--neutral)' : 'var(--black)')};
  font-weight: ${props => props.active && 'bold'};
  padding: 5px;
  text-align: center;
  border-radius: 0;
  cursor: pointer;
  + button {
    border-left: none;
  }
  :focus {
    outline-color: var(--purp);
    outline-style: inherit;
  }
`;

const NewTransaction = () => {
  const { register, handleSubmit, errors, reset, getValues } = useForm();
  console.log(getValues());
  const { addTransaction, stackLabels } = useTransactions();
  const [transactionType, setTransactionType] = useState('withdrawal');

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
      <FormInput
        name="description"
        errors={errors}
        register={register}
        required
        type="text"
        placeholder="Description"
        autoComplete="off"
      />
      <FormInput
        name="amount"
        errors={errors}
        register={register}
        type="number"
        pattern="\d*"
        placeholder="Amount"
        autoComplete="off"
        required
      />
      <FormSelect name="stack" defaultValue="" register={register} errors={errors} required>
        <option disabled name="select" value="">
          Select Stack
        </option>
        {stackLabels &&
          stackLabels.map(label => (
            <option key={`${label}-${Date.now()}`} value={label}>
              {label}
            </option>
          ))}
        }
      </FormSelect>
      <FormInput
        name="date"
        errors={errors}
        register={register}
        type="date"
        defaultValue={formatDate(new Date())}
        required
      />
      <TransactionTypeWrapper>
        <RadioButton
          type="button"
          active={transactionType === 'withdrawal'}
          onClick={() => setTransactionType('withdrawal')}
        >
          Withdrawal
        </RadioButton>
        <RadioButton type="button" active={transactionType === 'deposit'} onClick={() => setTransactionType('deposit')}>
          Deposit
        </RadioButton>
      </TransactionTypeWrapper>
      <ActionButton type="submit">Add</ActionButton>
    </NewtransactionWrapper>
  );
};
export default NewTransaction;
