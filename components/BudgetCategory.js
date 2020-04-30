import React from 'react';
import useBudget from '../hooks/useBudget';

const BudgetCategory = ({ label }) => {
  const { updateStack, removeStack, getStack } = useBudget();
  return (
    <>
      <label htmlFor={label}>
        {label}:{' '}
        <input
          id={label}
          type="number"
          value={getStack(label).value}
          onChange={e => updateStack(label, e.target.value)}
        />
      </label>
      <input type="button" value="delete" onClick={() => removeStack(label)} />
      <br />
    </>
  );
};
export default BudgetCategory;
