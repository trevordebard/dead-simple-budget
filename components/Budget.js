import React from 'react';
import { useForm } from 'react-hook-form';
import useBudget from '../hooks/useBudget';
import Input from './Input';
import BudgetStack from './BudgetStack';
import RequireLogin from './RequireLogin';

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
      <h1>Budget</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        Total: <Input register={register} name="total" defaultValue={data?.total} errors={errors} />
        <p style={{ color: 'red' }}>To Be Budgeted: {data?.toBeBudgeted}</p>
        {renderStacks(data?.stacks, data._id)}
        <div style={{ marginTop: '10px' }}>
          New Stack: <Input name="newStack" register={register({ required: true })} errors={errors} />
          <Input
            type="button"
            value="Add Stack"
            register={register}
            name="addStack"
            onClick={handleSubmit(onAddStack)}
          />
        </div>
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
