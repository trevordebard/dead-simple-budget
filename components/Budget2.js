import React from 'react';
import { useForm, ErrorMessage } from 'react-hook-form';
import BudgetCategory from './BudgetCategory';
import useBudget2 from '../hooks/useBudget2';

function Budget2() {
  const { data } = useBudget2();
  const { register, handleSubmit, errors, reset } = useForm();
  console.log(data);
  return (
    <div>
      <p>Budget2!</p>
      <form>
        <label htmlFor="total">
          Total: <input name="total" defaultValue="" ref={register} />
          <ErrorMessage errors={errors} name="total">
            {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
          </ErrorMessage>
        </label>
        <p style={{ color: 'red' }}>To Be Budgeted: {data?.toBeBudgeted}</p>
        {renderStacks(data?.stacks)}
      </form>
      <hr></hr>
      {/* <button
          type="button"
          onClick={() => {
            addStack(newCategory);
            setNewCategory('');
          }}
        >
          Add Category
        </button> */}
      <br />
    </div>
  );
  function renderStacks(stacks) {
    return stacks?.map(item => (
      <div>
        <label htmlFor={item.label}>
          {item.label}: <input name="total" defaultValue={item.value} ref={register} />
          <ErrorMessage errors={errors} name="total">
            {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
          </ErrorMessage>
        </label>
      </div>
    ));
  }
}

export default Budget2;
