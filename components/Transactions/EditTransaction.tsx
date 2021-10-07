import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { formatDate } from '../../lib/formatDate';
import { Button, RadioButton, RadioGroup, Input, ListRow } from '../Styled';
import { ErrorText } from './NewTransaction';
import { useEditTransaction, useStacks, useTransaction } from 'lib/hooks';
import { centsToDollars, dollarsToCents } from 'lib/money';
import { StackDropdown } from 'components/Stack';

const EditTransactionWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 500px;
  min-width: 250px;
  max-width: 500px;
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

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const EditTransaction = ({ transactionId, cancelEdit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const { data: stacks } = useStacks();
  const { mutate: editTransaction } = useEditTransaction();

  const [transactionType, setTransactionType] = useState<string | null>();
  const { data: transaction, isLoading: isLoadingTransaction } = useTransaction(transactionId);

  useEffect(() => {
    if (transaction) {
      setTransactionType(transaction.type);
    }
  }, [transaction, setTransactionType]);

  const onSubmit = payload => {
    const { date, stack, description } = payload;
    let { amount } = payload;
    amount = parseFloat(amount);
    amount = dollarsToCents(amount);

    if (transactionType === 'withdrawal') {
      amount = -amount;
    }
    editTransaction(
      {
        transactionId,
        transactionInput: {
          description,
          stack,
          amount,
          type: transactionType,
          date,
        },
      },
      { onSuccess: () => cancelEdit() }
    );
  };
  if (!transaction && !isLoadingTransaction) {
    return <h1 style={{ textAlign: 'center' }}>Not Found</h1>;
  }
  if (isLoadingTransaction) {
    return <p>Loading...</p>;
  }
  if (!transaction || !stacks) {
    return null;
  }
  return (
    <EditTransactionWrapper onSubmit={handleSubmit(onSubmit)}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h4>Edit Transaction</h4>
      </div>
      <label htmlFor="description">Description {errors.description && <ErrorText> (Required)</ErrorText>}</label>
      <Input
        name="description"
        category="underline"
        {...register('description', { required: true })}
        type="text"
        defaultValue={transaction.description}
        autoComplete="off"
      />
      <label htmlFor="amount">Amount {errors.amount && <ErrorText> (Required)</ErrorText>}</label>
      <Input
        name="amount"
        {...register('amount', { required: true })}
        category="underline"
        type="number"
        pattern="\d*"
        step={0.01}
        placeholder="Amount"
        defaultValue={centsToDollars(Math.abs(transaction.amount))}
        autoComplete="off"
      />

      <label htmlFor="stack">Stack {errors.stack && <ErrorText> (Required)</ErrorText>}</label>
      <Controller
        control={control}
        name="stack"
        defaultValue={transaction.stack}
        rules={{
          validate: value => {
            return value !== 'Imported';
          },
        }}
        render={({ field }) => (
          <StackDropdown defaultStack={transaction.stack} onSelect={value => field.onChange(value)} />
        )}
      />

      <label htmlFor="date">Date {errors.date && <ErrorText> (Required)</ErrorText>}</label>
      <Input
        name="date"
        category="underline"
        {...register('date', { required: true })}
        type="date"
        defaultValue={formatDate(transaction.date)}
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
        Save Changes
      </Button>
      <Button
        category="TRANSPARENT"
        small
        onClick={e => {
          e.preventDefault();
          cancelEdit();
        }}
        style={{ alignSelf: 'center' }}
      >
        Cancel
      </Button>
    </EditTransactionWrapper>
  );
};
export default EditTransaction;
