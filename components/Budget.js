import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import useBudget from '../hooks/useBudget';
import FormInput from './FormInput';
import BudgetStack from './BudgetStack';
import { Button } from './styled';
import EditableText from './EditableText';

const ToplineBudget = styled.div`
  text-align: center;
  margin-bottom: 30px; /*TODO: temporary */
`;

const BudgetWrapper = styled.div`
  max-width: 85vw;
`;
const Amount = styled.span`
  font-weight: 500;
  color: ${props => (props.danger ? 'var(--danger)' : 'var(--fontColor)')};
  ::before {
    content: '$';
  }
  span {
    &:hover {
      color: ${props => (props.editable ? 'var(--action)' : 'inherit')};
      cursor: ${props => (props.editable ? 'pointer' : 'inherit')};
    }
  }
`;
const SubText = styled.span`
  font-weight: 400;
  color: var(--fontColor-o60);
`;

const AddStackWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 10px 0px;
  grid-column-gap: 5px;
  white-space: nowrap;
`;

function Budget() {
  const { data, loading, error, addStack, updateStack, removeStack, updateTotal } = useBudget();
  const { register, handleSubmit, errors, reset, setValue } = useForm();
  const [editTotalVisible, setEditTotalVisible] = useState(false);

  if (loading || !data) {
    return <span>loading...</span>;
  }
  if (error) {
    console.error(error);
    return <p>error...</p>;
  }
  const onSubmit = payload => {
    console.log(payload);
  };
  const onAddStack = payload => {
    addStack({
      variables: { newStackLabel: payload.newStack, budgetId: data.id },
    });
    reset({ newStack: '' });
  };
  return (
    <BudgetWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ToplineBudget>
          <h1>Budget</h1>
          <h5>
            <Amount editable danger={data.total < 0} onClick={() => setEditTotalVisible(!editTotalVisible)}>
              <EditableText
                text={data.total}
                update={total =>
                  updateTotal({
                    variables: {
                      total: parseFloat(total),
                      budgetId: data.id,
                    },
                  })}
                inputType="number"
              />
            </Amount>
            <SubText> in account</SubText>
          </h5>
          <h5>
            <Amount danger={data.toBeBudgeted < 0}>{data.toBeBudgeted}</Amount>
            <SubText> to be budgeted</SubText>
          </h5>
        </ToplineBudget>
        {data.stacks && renderStacks(data?.stacks, data.id)}
        <AddStackWrapper>
          <FormInput name="newStack" register={register} errors={errors} placeholder="Stack Name" autoComplete="off" />
          <Button isAction register={register} name="addStack" onClick={handleSubmit(onAddStack)}>
            Add Stack
          </Button>
        </AddStackWrapper>
      </form>
      <br />
    </BudgetWrapper>
  );
  function renderStacks(stacks, budgetId) {
    return stacks.map(item => (
      <div key={item.id}>
        <BudgetStack
          label={item.label}
          register={register}
          budgetId={budgetId}
          amount={item.amount}
          errors={errors}
          updateStack={updateStack}
          removeStack={removeStack}
          setValue={setValue}
        />
      </div>
    ));
  }
}

export default Budget;
