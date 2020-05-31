import React from 'react';
import { useForm, ErrorMessage } from 'react-hook-form';
import { useMutation, gql } from '@apollo/client';
import useBudget2 from '../hooks/useBudget2';

const UPDATE_STACK = gql`
  mutation($budgetId: MongoID!, $label: String!, $value: Float!) {
    budgetUpdateStack(budgetId: $budgetId, label: $label, value: $value) {
      total
      toBeBudgeted
      stacks {
        value
        label
      }
    }
  }
`;
function Budget2() {
  const { data, loading } = useBudget2();
  const { register, handleSubmit, errors } = useForm();
  const [updateStack] = useMutation(UPDATE_STACK);
  if (loading) {
    return <p>Loading...</p>;
  }
  const onSubmit = payload => {
    console.log(payload);
  };
  return (
    <div>
      <p>Budget2!</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="total">
          Total: <input name="total" defaultValue={data?.total} ref={register} />
          <ErrorMessage errors={errors} name="total">
            {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
          </ErrorMessage>
        </label>
        <p style={{ color: 'red' }}>To Be Budgeted: {data?.toBeBudgeted}</p>
        {renderStacks(data?.stacks, data._id)}
      </form>
      <hr></hr>
      <br />
    </div>
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
        />
      </div>
    ));
  }
}

const BudgetStack = ({ label, register, budgetId, value, errors, updateStack }) => (
  <>
    <label htmlFor={label}>
      {label}:{' '}
      <input
        name={label}
        onChange={e => console.log(e.target.value)}
        onFocus={e => console.log(e.target.value)}
        type="number"
        onBlur={e => {
          updateStack({
            variables: {
              budgetId,
              label,
              value: parseFloat(e.target.value),
            },
          });
        }}
        defaultValue={value}
        ref={register}
      />
      <ErrorMessage errors={errors} name="total">
        {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
      </ErrorMessage>
    </label>
  </>
);

export default Budget2;
