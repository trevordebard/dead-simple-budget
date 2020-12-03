import { useApolloClient, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import FormInput, { FormSelect } from './FormInput';
import useTransactions from '../hooks/useTransactions';
import { formatDate } from '../lib/formatDate';
import { Button, RadioButton, RadioGroup } from './styled';

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

const EditTransaction = ({ transactionId, cancelEdit }) => {
  const client = useApolloClient();
  const { register, handleSubmit, errors, reset, getValues } = useForm();
  const { editTransaction, stackLabels } = useTransactions();
  const [cachedTransaction, setCachedTransction] = useState();
  const [selectedStack, setSelectedStack] = useState();
  const [transactionType, setTransactionType] = useState();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    reset();
    // TODO: Not sure why I did this with fragments. Look into better way to do this on load to prevent flicker
    const data = client.readFragment({
      id: `transactions:${transactionId}`,
      fragment: gql`
        fragment selectedTransaction on transactions {
          id
          amount
          date
          stack
          description
          type
        }
      `,
    });
    if (!data) {
      setNotFound(true);
    } else {
      setCachedTransction(data);
      setSelectedStack(data?.stack);
      setTransactionType(data?.type);
    }
  }, [client, getValues, reset, transactionId]);

  const onSubmit = payload => {
    const { date, stack, description } = payload;
    let { amount } = payload;
    amount = parseFloat(amount);
    if (transactionType === 'withdrawal') {
      amount = -amount;
    }
    editTransaction(transactionId, description, amount, stack, date, transactionType);
    cancelEdit();
  };
  if (notFound) {
    return <h1 style={{ textAlign: 'center' }}>Not Found</h1>;
  }
  if (!cachedTransaction) {
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
        defaultValue={cachedTransaction.description}
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
      <Button category="ACTION" type="submit">
        Save Changes
      </Button>
      <Button
        category="TRANSPARENT"
        discrete
        small
        underline
        onClick={() => cancelEdit()}
        style={{ alignSelf: 'center' }}
      >
        Cancel
      </Button>
    </EditTransactionWrapper>
  );
};
export default EditTransaction;
