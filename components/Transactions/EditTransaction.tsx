import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import useTransactions from './useTransactions';
import { formatDate } from '../../lib/formatDate';
import { Button, RadioButton, RadioGroup, Input, Select } from '../Styled';
import { ErrorText } from './NewTransaction';
import { useQuery } from 'react-query';
import { Transaction } from '.prisma/client';
import { fetchTransactionById } from './queries/getTransactionById';

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

const EditTransaction = ({ transactionId, cancelEdit }) => {
  const [transaction, setTransaction] = useState<Transaction>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { editTransaction, stackLabels } = useTransactions();

  const [selectedStack, setSelectedStack] = useState('');
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const { data: fetchResponse, isLoading: loading } = useQuery(
    [`fetch-transaction-${transactionId}`, { transactionId }],
    fetchTransactionById
  );
  useEffect(() => {
    if (fetchResponse) {
      setTransaction(fetchResponse.data);
    }
  }, [fetchResponse]);

  const onSubmit = payload => {
    const { date, stack, description } = payload;
    let { amount } = payload;
    amount = parseFloat(amount);
    if (transactionType === 'withdrawal') {
      amount = -amount;
    }
    editTransaction({
      transactionId,
      transactionInput: {
        description,
        stack,
        amount,
        type: transactionType,
        date,
      },
    });
    cancelEdit();
  };
  if (!transaction && !loading) {
    return <h1 style={{ textAlign: 'center' }}>Not Found</h1>;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (!transaction) {
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
        defaultValue={Math.abs(transaction.amount)}
        autoComplete="off"
      />

      <label htmlFor="stack">Stack {errors.stack && <ErrorText> (Required)</ErrorText>}</label>
      <Select
        name="stack"
        {...register('stack', { required: true })}
        value={selectedStack}
        onChange={e => setSelectedStack(e.target.value)}
      >
        {stackLabels &&
          stackLabels.map(label => (
            <option key={`${label}-${Date.now()}`} value={label}>
              {label}
            </option>
          ))}
      </Select>
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
      <Button category="TRANSPARENT" small onClick={() => cancelEdit()} style={{ alignSelf: 'center' }}>
        Cancel
      </Button>
    </EditTransactionWrapper>
  );
};
export default EditTransaction;
