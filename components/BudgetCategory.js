import React, { useEffect } from 'react';
import useInput from '../hooks/useInput';
import useDebounce from '../hooks/useDebounce';
import useBudget from '../hooks/useBudget';

const BudgetCategory = ({ label, value }) => {
  const [total, changeTotal] = useInput(value);
  const { updateBudgetCategory, removeCategory } = useBudget();
  const debouncedTotal = useDebounce(total, 1000);

  useEffect(() => {
    updateBudgetCategory(label, debouncedTotal);
  }, [debouncedTotal, label, updateBudgetCategory]);
  return (
    <>
      <label htmlFor={label}>
        {label}: <input id={label} type="number" value={total} onChange={changeTotal} />
      </label>
      <input type="button" value="delete" onClick={() => removeCategory(label)} />
      <br />
    </>
  );
};
export default BudgetCategory;
