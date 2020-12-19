import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useState } from 'react';
import Link from 'next/link';
import useTransactions from './useTransactions';
import { Button, Input, RadioButton, RadioGroup, Select } from '../Styled';

const UploadLink = styled.a`
  text-decoration: none;
  color: inherit;
  font-size: var(--smallFontSize);
  text-decoration: underline;
`;
const NewtransactionWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 500px;
  min-width: 250px;
  max-width: 500px;
  label {
    color: var(--grey-800);
  }
  input,
  select,
  button {
    margin-bottom: 15px;
  }
  input::placeholder,
  select:required:invalid {
    color: var(--fontColorLighter);
  }
`;

const ErrorText = styled.span`
  color: var(--red-500);
  font-size: 0.9em;
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
    console.log(errors);
    amount = parseFloat(amount);
    if (transactionType === 'withdrawal') {
      amount = -amount;
    }

    reset();
    addTransaction(description, amount, stack, date, transactionType);
  };
  return (
    <NewtransactionWrapper onSubmit={handleSubmit(onSubmit)}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h4>New Transaction</h4>
      </div>
      <label htmlFor="description">Description {errors.description && <ErrorText> (Required)</ErrorText>}</label>
      <Input name="description" category="underline" placeholder="Tasy Pizza LLC" ref={register({ required: true })} />

      <label htmlFor="amount">Amount {errors.amount && <ErrorText> (Required)</ErrorText>}</label>
      <Input
        name="amount"
        category="underline"
        ref={register({ required: true })}
        type="number"
        pattern="\d*"
        step={0.01}
        placeholder="37.50"
        autoComplete="off"
      />
      <label htmlFor="stack">Stack {errors.stack && <ErrorText> (Required)</ErrorText>}</label>
      <Select
        name="stack"
        value={selectedStack}
        ref={register({ required: true })}
        errors={errors}
        required
        onChange={e => setSelectedStack(e.target.value)}
      >
        <option disabled name="select" value="" style={{ color: 'blue' }}>
          Select Stack
        </option>
        {stackLabels &&
          stackLabels.map(label => (
            <option key={`${label}-${Date.now()}`} value={label}>
              {label}
            </option>
          ))}
      </Select>
      <label htmlFor="date1">Date {errors.date1 && <ErrorText> (Required)</ErrorText>}</label>
      <Input
        name="date1"
        category="underline"
        errors={errors}
        ref={register({
          valueAsDate: true,
          required: true,
        })}
        type="date"
        placeholder="yyyy-mm-dd"
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
      <div style={{ textAlign: 'center' }}>
        <Link href="/upload" passHref>
          <UploadLink>Import Transactions</UploadLink>
        </Link>
      </div>
    </NewtransactionWrapper>
  );
};
export default NewTransaction;
