import { useApolloClient, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { ActionButton, TransparentButton, RadioButton } from './styled';
import FormInput, { FormSelect } from './FormInput';
import useTransactions from '../hooks/useTransactions';
import { formatDate } from '../lib/formatDate';

const EditTransactionWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  max-width: 60rem;

  * {
    margin-bottom: 10px;
  }
`;
const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const EditTransaction = ({ transactionId, cancelEdit }) => {
  const client = useApolloClient();
  const { register, handleSubmit, errors, reset, getValues } = useForm();
  const { editTransaction, stackLabels } = useTransactions();
  const [cachedTransaction, setCachedTransction] = useState();
  const [selectedStack, setSelectedStack] = useState();
  const [transactionType, setTransactionType] = useState();

  useEffect(() => {
    reset();
    const data = client.readFragment({
      id: `Transaction:${transactionId}`,
      fragment: gql`
        fragment myTest on Transaction {
          _id
          amount
          date
          stack
          description
          type
        }
      `,
    });
    setSelectedStack(data.stack);
    setCachedTransction(data);
    setTransactionType(data.type);
  }, [client, getValues, reset, transactionId]);

  const onSubmit = payload => {
    const { date, stack, description } = payload;
    let { amount } = payload;
    amount = parseFloat(amount);
    if (transactionType === 'withdrawal') {
      amount = -amount;
    }
    editTransaction({
      variables: {
        record: {
          _id: transactionId,
          amount,
          date,
          stack,
          description,
          type: transactionType,
        },
      },
    });
    cancelEdit();
  };
  if (!cachedTransaction) {
    return <div>Error</div>;
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
        defaultValue={cachedTransaction.description}
        autoComplete="off"
      />
      <FormInput
        name="amount"
        errors={errors}
        register={register}
        type="number"
        pattern="\d*"
        placeholder="Amount"
        defaultValue={Math.abs(cachedTransaction.amount)}
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
        defaultValue={formatDate(cachedTransaction.date)}
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
      <ActionButton type="submit">Save Changes</ActionButton>
      <TransparentButton discrete small underline onClick={() => cancelEdit()} style={{ alignSelf: 'center' }}>
        Cancel
      </TransparentButton>
    </EditTransactionWrapper>
  );
};
export default EditTransaction;
