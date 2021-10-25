import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useState } from 'react';
import { Button, Input, RadioButton, RadioGroup, SimpleFormWrapper } from '../Styled';
import { useCreateTransaction } from 'lib/hooks';
import { dollarsToCents } from 'lib/money';
import { StackDropdown } from 'components/Stack';

export const ErrorText = styled.span`
  color: var(--red-500);
  font-size: 0.9em;
`;

const NewTransactionWrapper = styled.div`
  max-width: 500px;
  width: 100%;
`;

interface iNewTransactionProps {
  cancelCreateNew?: () => void;
}
const NewTransaction = ({ cancelCreateNew }: iNewTransactionProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();
  const { mutate: createTransaction } = useCreateTransaction();
  const [transactionType, setTransactionType] = useState('withdrawal');

  const onSubmit = data => {
    const { description, stack } = data;
    let { amount, date } = data;
    amount = parseFloat(amount);
    amount = dollarsToCents(amount);
    if (transactionType === 'withdrawal') {
      amount = amount * -1;
    }

    createTransaction(
      { transactionInput: { amount, description, stack, type: transactionType, date } },
      { onSuccess: () => reset() }
    );
  };
  return (
    <NewTransactionWrapper>
      <SimpleFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h4>New Transaction</h4>
        </div>
        <label htmlFor="description">Description {errors.description && <ErrorText> (Required)</ErrorText>}</label>
        <Input
          name="description"
          category="underline"
          placeholder="Tasy Pizza LLC"
          {...register('description', { required: true })}
        />

        <label htmlFor="amount">Amount {errors.amount && <ErrorText> (Required)</ErrorText>}</label>
        <Input
          name="amount"
          category="underline"
          {...register('amount', { required: true })}
          type="number"
          pattern="\d*"
          step={0.01}
          placeholder="37.50"
          autoComplete="off"
        />
        <label htmlFor="stack">Stack {errors.stack && <ErrorText> (Required)</ErrorText>}</label>
        <Controller
          control={control}
          name="stack"
          defaultValue="Select a Stack"
          rules={{
            validate: value => {
              return value !== 'Select a Stack';
            },
          }}
          render={({ field }) => (
            <StackDropdown defaultStack="Select a Stack" onSelect={value => field.onChange(value)} />
          )}
        />
        <label htmlFor="date">Date {errors.date && <ErrorText> (Required)</ErrorText>}</label>
        <Input
          name="date"
          category="underline"
          {...register('date', { required: true })}
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
          <RadioButton
            type="button"
            active={transactionType === 'deposit'}
            onClick={() => setTransactionType('deposit')}
          >
            Deposit
          </RadioButton>
        </RadioGroup>
        <Button category="ACTION" type="submit">
          Add
        </Button>
        {cancelCreateNew && (
          <Button
            category="TRANSPARENT"
            small
            onClick={e => {
              e.preventDefault();
              cancelCreateNew();
            }}
            style={{ alignSelf: 'center' }}
          >
            Cancel
          </Button>
        )}
      </SimpleFormWrapper>
    </NewTransactionWrapper>
  );
};
export default NewTransaction;
