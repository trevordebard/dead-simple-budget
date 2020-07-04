import { useApolloClient, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { ActionButton, TransparentButton } from './styled';
import FormInput, { FormSelect } from './FormInput';
import useTransactions from '../hooks/useTransactions';
import { formatDate } from '../lib/formatDate';

const NewtransactionWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  max-width: 60rem;

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

  useEffect(() => {
    console.log(getValues());
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
        }
      `,
    });
    setSelectedStack(data.stack);
    setCachedTransction(data);
  }, [client, getValues, reset, transactionId]);

  const onSubmit = payload => {
    const { amount, date, stack, description } = payload;
    editTransaction({
      variables: {
        record: {
          _id: transactionId,
          amount: parseFloat(amount),
          date,
          stack,
          description,
        },
      },
    });
    cancelEdit();
  };
  if (!cachedTransaction) {
    return <div>Error</div>;
  }
  return (
    <NewtransactionWrapper onSubmit={handleSubmit(onSubmit)}>
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
        defaultValue={cachedTransaction.amount}
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
        {stackLabels && stackLabels.map(value => <option value={value}>{value}</option>)}
      </FormSelect>
      <FormInput
        name="date"
        errors={errors}
        register={register}
        type="date"
        defaultValue={formatDate(cachedTransaction.date)}
        required
      />
      <ActionButton>Save Changes</ActionButton>
      <TransparentButton discrete small underline onClick={() => cancelEdit()} style={{ alignSelf: 'center' }}>
        Cancel
      </TransparentButton>
    </NewtransactionWrapper>
  );
};
export default EditTransaction;
