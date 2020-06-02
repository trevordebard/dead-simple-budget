import React, { useState } from 'react';
import { useForm, ErrorMessage } from 'react-hook-form';
import useBudget from '../hooks/useBudget';

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
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="total">
          Total: <input name="total" defaultValue={data?.total} ref={register} />
          <ErrorMessage errors={errors} name="total">
            {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
          </ErrorMessage>
        </label>
        <p style={{ color: 'red' }}>To Be Budgeted: {data?.toBeBudgeted}</p>
        {renderStacks(data?.stacks, data._id)}
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="newStack">
            New Stack: <input name="newStack" ref={register} />
            <ErrorMessage errors={errors} name="total">
              {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
            </ErrorMessage>
            <button
              type="button"
              onClick={handleSubmit(payload => {
                reset({ newStack: '' });
                addStack({
                  variables: { newStackLabel: payload.newStack, budgetId: data._id },
                  refetchQueries: ['GET_BUDGET'], // Eventually change to update cache
                });
              })}
            >
              Add Stack
            </button>
          </label>
        </div>
      </form>
      <br />
    </>
  );
  function renderStacks(stacks, budgetId) {
    return stacks?.map(item => (
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

const BudgetStack = ({ label, register, budgetId, value, errors, updateStack, removeStack }) => {
  const [prevValue, setPrevValue] = useState(value);
  return (
    <>
      <label htmlFor={label}>
        {label}:{' '}
        <input
          name={label}
          type="number"
          onBlur={e => {
            const newVal = parseFloat(e.target.value);
            // Prevent api call if vlaue didn't change
            if (newVal !== prevValue) {
              updateStack({
                variables: {
                  budgetId,
                  label,
                  value: newVal,
                },
              });
              setPrevValue(newVal);
            }
          }}
          defaultValue={value}
          ref={register}
        />
        <button
          type="button"
          onClick={e => {
            removeStack({
              variables: {
                budgetId,
                label,
              },
            });
          }}
        >
          Delete
        </button>
        <ErrorMessage errors={errors} name="total">
          {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
        </ErrorMessage>
      </label>
    </>
  );
};

export default Budget;
