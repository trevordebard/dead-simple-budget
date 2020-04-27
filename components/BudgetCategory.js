import React from 'react';
import useBudget from '../hooks/useBudget';

const BudgetCategory = ({ label }) => {
  const { updateBudgetCategory, removeCategory, getCategory } = useBudget();
  return (
    <>
      <label htmlFor={label}>
        {label}:{' '}
        <input
          id={label}
          type="number"
          value={getCategory(label).value}
          onChange={e => updateBudgetCategory(label, e.target.value)}
        />
      </label>
      <input type="button" value="delete" onClick={() => removeCategory(label)} />
      <br />
    </>
  );
};
export default BudgetCategory;
