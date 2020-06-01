import React from 'react';
import { useForm, ErrorMessage } from 'react-hook-form';
import { useMutation, gql, resetApolloContext } from '@apollo/client';
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
const ADD_STACK = gql`
  mutation($budgetId: MongoID!, $newStackLabel: String!, $newStackValue: Float) {
    budgetPushToStacks(budgetId: $budgetId, newStackLabel: $newStackLabel, newStackValue: $newStackValue) {
      total
      toBeBudgeted
      stacks {
        label
        value
      }
    }
  }
`;
const REMOVE_STACK = gql`
  mutation($budgetId: MongoID!, $label: String!) {
    budgetRemoveStack(budgetId: $budgetId, label: $label) {
      total
      toBeBudgeted
      stacks {
        label
        value
      }
    }
  }
`;
function Budget2() {
  const { data, loading } = useBudget2();
  const { register, handleSubmit, errors, reset } = useForm();
  const [addStack] = useMutation(ADD_STACK);
  const [updateStack] = useMutation(UPDATE_STACK);
  const [removeStack] = useMutation(REMOVE_STACK);
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
        <div>
          <label htmlFor="total">
            Total: <input name="total" defaultValue={data?.total} ref={register} />
            <ErrorMessage errors={errors} name="total">
              {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
            </ErrorMessage>
          </label>
        </div>
        <div>
          <p style={{ color: 'red' }}>To Be Budgeted: {data?.toBeBudgeted}</p>
        </div>
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
          removeStack={removeStack}
        />
      </div>
    ));
  }
}

const BudgetStack = ({ label, register, budgetId, value, errors, updateStack, removeStack }) => (
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

export default Budget2;
