import { useApolloClient, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Button } from './styled';
import FormInput from './FormInput';
import useTransactions from '../hooks/useTransactions';
import { formatDate } from '../lib/formatDate';

const NewtransactionWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  max-width: 60rem;
`;

const EditTransaction = ({ transactionId }) => {
  const client = useApolloClient();
  const { register, handleSubmit, errors, reset, getValues } = useForm();
  const { addTransaction, stackLabels } = useTransactions();
  const [cachedTransaction, setCachedTransction] = useState();
  const [selectedStack, setSelectedStack] = useState();
  useEffect(() => {
    console.log(getValues());
    reset();
    console.log(getValues());
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
  if (!cachedTransaction) {
    return <div>Error</div>;
  }
  return (
    <NewtransactionWrapper>
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

      <Select
        name="amount"
        register={register}
        errors={errors}
        options={stackLabels}
        value={selectedStack}
        onChange={e => setSelectedStack(e.target.value)}
      />
      <FormInput
        name="date"
        errors={errors}
        register={register}
        type="date"
        defaultValue={formatDate(cachedTransaction.date)}
        required
      />
      <Button isAction>Save Changes</Button>
    </NewtransactionWrapper>
  );
};
export default EditTransaction;

export function Select({ register, options, name, ...rest }) {
  return (
    <select name={name} ref={register} {...rest}>
      {options.map(value => (
        <option value={value}>{value}</option>
      ))}
    </select>
  );
}
