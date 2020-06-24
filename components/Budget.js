import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import useBudget from '../hooks/useBudget';
import Input from './Input';
import BudgetStack from './BudgetStack';
import RequireLogin from './RequireLogin';
import { Button, HeaderOne, HeaderFive } from './styled';

const ToplineBudget = styled.div`
  text-align: center;
  margin-bottom: 30px; /*TODO: temporary */
`;

const AddStackWrapper = styled.div`
  min-width: 350px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 10px 0px;
  input {
    margin: 0px 5px;
    height: 36px;
  }
`;

const NewStackInput = styled(Input)`
  background-color: transparent;
  :focus {
    outline: 1px solid var(--purp-15);
  }
`;
function Budget() {
  const { data, loading, error, addStack, updateStack, removeStack } = useBudget();
  const { register, handleSubmit, errors, reset } = useForm();

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    console.error(error);
    return <p>error...</p>;
  }
  const onSubmit = payload => {
    console.log(payload);
  };
  const onAddStack = payload => {
    reset({ newStack: '' });
    addStack({
      variables: { newStackLabel: payload.newStack, budgetId: data._id },
      refetchQueries: ['GET_BUDGET'], // Eventually change to update cache
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ToplineBudget>
          <HeaderOne>Budget</HeaderOne>
          <HeaderFive>
            <span style={{ fontWeight: '500' }}>${data.total}</span>
            <span style={{ fontWeight: '400', color: 'var(--fontColor60)' }}> in account</span>
          </HeaderFive>
          <h3 register={register}>
            <span style={{ fontWeight: '500' }}>${data.toBeBudgeted}</span>
            <span style={{ fontWeight: '400', color: 'var(--fontColor60)' }}> to be budgeted</span>
          </h3>
          {/* Total: <Input register={register} name="total" defaultValue={data?.total} errors={errors} /> */}
          {/* <p style={{ color: 'red' }}>To Be Budgeted: {data?.toBeBudgeted}</p> */}
        </ToplineBudget>
        {renderStacks(data?.stacks, data._id)}
        <AddStackWrapper style={{ width: '' }}>
          <NewStackInput
            name="newStack"
            register={register({ required: true })}
            errors={errors}
            placeholder="Stack Name"
          />
          <Button action type="button" register={register} name="addStack" onClick={handleSubmit(onAddStack)}>
            Add Stack
          </Button>
        </AddStackWrapper>
      </form>
      <br />
    </div>
  );

  function renderStacks(stacks, budgetId) {
    return stacks.map(item => (
      <div key={item._id}>
        <BudgetStack
          label={item.label}
          register={register}
          budgetId={budgetId}
          value={item.value}
          errors={errors}
          updateStack={updateStack}
          removeStack={removeStack}
        />
      </div>
    ));
  }
}

export default RequireLogin(Budget);
