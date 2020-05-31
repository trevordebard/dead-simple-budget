import React from 'react';
import useBudget from '../hooks/useBudget';

const BudgetCategory = ({ label, value }) => (
  // const { updateStack, removeStack, getStack } = useBudget();
  <>
    <label htmlFor={label}>
      {label}:{' '}
      <input
        id={label}
        type="number"
        value={value}
        // onChange={e => updateStack(label, e.target.value)}
      />
    </label>
    {/* <input type="button" value="delete" onClick={() => removeStack(label)} /> */}
    <br />
  </>
);
export default BudgetCategory;
