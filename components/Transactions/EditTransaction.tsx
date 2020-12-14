import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useGetTransactionQuery } from 'graphql/generated/codegen';
import FormInput, { FormSelect } from '../Shared/FormInput';
import useTransactions from './useTransactions';
import { formatDate } from '../../lib/formatDate';
import { Button, RadioButton, RadioGroup } from '../Styled';

const EditTransactionWrapper = styled.form`
  text-align: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  min-width: 250px;
  max-width: 400px;
  * {
    margin-bottom: 10px;
  }
`;
const GET_TRANSACTION = gql`
  query getTransaction($id: Int!) {
    transaction(where: { id: $id }) {
      id
      amount
      date
      stack
      description
      type
    }
  }
`;

const EditTransaction = ({ transactionId, cancelEdit }) => {
  const { register, handleSubmit, errors } = useForm();
  const { editTransaction, stackLabels } = useTransactions();
  const [selectedStack, setSelectedStack] = useState();
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const { data, loading } = useGetTransactionQuery({ variables: { id: transactionId }, skip: transactionId === null });
  useEffect(() => {
    if (data) {
      setTransactionType('')
      setTransactionType(data.transaction.type)
    }
  }, [data])
  const onSubmit = payload => {
    const { date, stack, description } = payload;
    let { amount } = payload;
    amount = parseFloat(amount);
    if (transactionType === 'withdrawal') {
      amount = -amount;
    }
    editTransaction(transactionId, description, amount, stack, date, transactionType, null);
    cancelEdit();
  };
  if (!data && !loading) {
    return <h1 style={{ textAlign: 'center' }}>Not Found</h1>;
  }
  if (!data) {
    return null;
  }
  return (
    <EditTransactionWrapper onSubmit={handleSubmit(onSubmit)}>
      <h4>Edit Transaction</h4>
      <FormInput
        name="description"
        errors={errors}
        register={register}
        required
        type="text"
        defaultValue={data.transaction.description}
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
        defaultValue={Math.abs(data.transaction.amount)}
        autoComplete="off"
        required
      />

      <FormSelect
        name="stack"
        register={register}
        errors={errors}
        value={selectedStack}
        onChange={e => setSelectedStack(e.target.value)}
      >
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
        defaultValue={formatDate(data.transaction.date)}
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
        onClick={() => cancelEdit()}
        style={{ alignSelf: 'center' }}
      >
        Cancel
      </Button>
    </EditTransactionWrapper>
  );
};
export default EditTransaction;
