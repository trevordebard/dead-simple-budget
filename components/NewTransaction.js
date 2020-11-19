import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useState } from 'react';
import Link from 'next/link';
import useTransactions from '../hooks/useTransactions';
import { Button, RadioButton, RadioGroup } from './styled';
import FormInput, { FormSelect } from './FormInput';
import { formatDate } from '../lib/formatDate';

const UploadLink = styled.a`
  text-decoration: none;
  color: inherit;
  font-size: var(--smallFontSize);
  text-decoration: underline;
`;
const NewtransactionWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1em;
  max-width: 60rem;
  text-align: center;
  > * {
    margin-bottom: 10px;
  }
`;

const NewTransaction = () => {
  const { register, handleSubmit, errors, reset, getValues } = useForm();
  const [selectedStack, setSelectedStack] = useState('');
  const { addTransaction, stackLabels } = useTransactions();
  const [transactionType, setTransactionType] = useState('withdrawal');

  const onSubmit = () => {
    const data = getValues();
    const { description, stack } = data;
    let { amount, date } = data;

    amount = parseFloat(amount);
    if (transactionType === 'withdrawal') {
      amount = -amount;
    }

    reset();
    addTransaction(description, amount, stack, date, transactionType);
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
        step={0.01}
        placeholder="Amount"
        autoComplete="off"
        required
      />
      <FormSelect
        name="stack"
        value={selectedStack}
        register={register}
        errors={errors}
        required
        onChange={e => setSelectedStack(e.target.value)}
      >
        <option disabled name="select" value="">
          Select Stack
        </option>
        {stackLabels &&
          stackLabels.map(label => (
            <option key={`${label}-${Date.now()}`} value={label}>
              {label}
            </option>
          ))}
      </FormSelect>
      <FormInput
        name="date"
        errors={errors}
        register={register}
        type="date"
        defaultValue={formatDate(new Date())}
        required
      />
      <RadioGroup>
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
      </RadioGroup>
      <Button category="ACTION" type="submit">
        Add
      </Button>
      <Link href="/upload" passHref>
        <UploadLink>Import Transactions</UploadLink>
      </Link>
    </NewtransactionWrapper>
  );
};
export default NewTransaction;
