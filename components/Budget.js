import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import useBudget from '../hooks/useBudget';
import Input from './Input';
import BudgetStack from './BudgetStack';
import RequireLogin from './RequireLogin';

const ToplineBudget = styled.div`
  text-align: center;
  margin-bottom: 30px; /*TODO: temporary */
  h1 {
    padding-bottom: 10px;
  }
`;

const AddStackWrapper = styled.div`
  min-width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
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
const AddStackButton = styled(Input)`
  width: 100px;
  background-color: #2dadba;
  color: white;
  border-radius: 45px;
  border: 0px;
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
          <h1>Budget</h1>
          <h3>
            <span style={{ fontWeight: '500' }}>${data.total}</span>
            <span style={{ fontWeight: '400', color: 'var(--fontColor60)' }}> in account</span>
          </h3>
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
          <AddStackButton
            type="button"
            value="Add Stack"
            register={register}
            name="addStack"
            onClick={handleSubmit(onAddStack)}
          />
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
