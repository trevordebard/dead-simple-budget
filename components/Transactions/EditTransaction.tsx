import React, { useEffect, useState, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { formatDate } from '../../lib/formatDate';
import { Button, RadioButton, RadioGroup, Input, Select, ListRow } from '../Styled';
import { ErrorText } from './NewTransaction';
import { useEditTransaction, useStacks, useTransaction } from 'lib/hooks';
import useStackLabels from 'lib/hooks/stack/useStackLabels';
import { centsToDollars, dollarsToCents } from 'lib/money';
import ClickAwayListener from 'components/Shared/ClickAway';

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
    setValue,
  } = useForm();
  const { stackLabels } = useStackLabels();
  const { data: stacks } = useStacks();
  const { mutate: editTransaction } = useEditTransaction();
  const [isOpen, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!isOpen);

  const [selectedStack, setSelectedStack] = useState<string>();
  const [transactionType, setTransactionType] = useState<string | null>();
  const { data: transaction, isLoading: isLoadingTransaction } = useTransaction(transactionId);

  useEffect(() => {
    if (transaction) {
      setSelectedStack(transaction.stack);
      setTransactionType(transaction.type);
    }
  }, [transaction, setTransactionType, setSelectedStack]);

  useEffect(() => {
    setValue('stack', selectedStack);
  }, [setValue, selectedStack]);

  const onSubmit = payload => {
    console.log({ ...payload });
    // const { date, stack, description } = payload;
    // let { amount } = payload;
    // amount = parseFloat(amount);
    // amount = dollarsToCents(amount);

    // if (transactionType === 'withdrawal') {
    //   amount = -amount;
    // }
    // editTransaction(
    //   {
    //     transactionId,
    //     transactionInput: {
    //       description,
    //       stack,
    //       amount,
    //       type: transactionType,
    //       date,
    //     },
    //   },
    //   { onSuccess: () => cancelEdit() }
    // );
  };
  if (!transaction && !isLoadingTransaction) {
    return <h1 style={{ textAlign: 'center' }}>Not Found</h1>;
  }
  if (isLoadingTransaction) {
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
        defaultValue={centsToDollars(Math.abs(transaction.amount))}
        autoComplete="off"
      />

      <label htmlFor="stack">Stack {errors.stack && <ErrorText> (Required)</ErrorText>}</label>
      <Controller
        control={control}
        name="stack"
        rules={{ validate: value => value !== 'Imported' }}
        render={({ field }) => (
          <div>
            <DropdownWrapper>
              <DropdownHeader onClick={toggleDropdown} tabIndex={0}>
                {selectedStack}
              </DropdownHeader>
              <DropdownBody isOpen={isOpen}>
                {stacks.map(stack => (
                  <div
                    onClick={e => {
                      field.onChange(stack.label);
                      setSelectedStack(stack.label);
                    }}
                    key={stack.id}
                  >
                    <div>{stack.label}</div>
                    <div>{stack.amount}</div>
                  </div>
                ))}
              </DropdownBody>
            </DropdownWrapper>
          </div>
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

const StackSelectorField = ({ value, onChange }) => <StackSelector seletedStack={value} setSelectedStack={onChange} />;

const StackSelector = ({ seletedStack, setSelectedStack }) => {
  const [isOpen, setOpen] = useState(false);
  const { data: stacks } = useStacks();

  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = label => {
    seletedStack == label ? setSelectedStack(null) : setSelectedStack(label);
  };

  if (!stacks) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <DropdownWrapper>
        <DropdownHeader onClick={toggleDropdown} tabIndex={0}>
          {seletedStack}
        </DropdownHeader>
        <DropdownBody isOpen={isOpen}>
          {stacks.map(stack => (
            <ListRow selected={seletedStack === stack.id} onClick={e => handleItemClick(stack.label)} key={stack.id}>
              <div>{stack.label}</div>
              <div>{centsToDollars(stack.amount)}</div>
            </ListRow>
          ))}
        </DropdownBody>
      </DropdownWrapper>
    </ClickAwayListener>
  );
};

StackSelector.displayName = 'StackSelector';

const DropdownWrapper = styled.div`
  border-radius: 5px;
  position: relative;
  border: 1px solid var(--grey-800);
`;
const DropdownHeader = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem;
`;
const DropdownBody = styled.div<{ isOpen: boolean }>`
  padding: 5px;
  border: 1px solid black;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 5px;
  background-color: white;
`;

const DropdownItemDot = styled.span``;
