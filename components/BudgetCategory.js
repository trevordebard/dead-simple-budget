import React, { useEffect } from 'react';
import useInput from '../hooks/useInput';
import useDebounce from '../hooks/useDebounce';
import useBudget from '../hooks/useBudget';

const BudgetCategory = ({ label, value }) => {
  const [total, changeTotal] = useInput(value);
  const { dispatch } = useBudget();
  const debouncedTotal = useDebounce(total, 1000);

  useEffect(() => {
    dispatch({ type: 'updateBudget', payload: { category: label, value: debouncedTotal || 0 } });
  }, [dispatch, label, debouncedTotal]);
  return (
    <>
      <label htmlFor={label}>
        {label}: <input id={label} type="number" value={total} onChange={changeTotal} />
      </label>
      <input
        type="button"
        value="delete"
        onClick={() => dispatch({ type: 'removeBudgetCategory', payload: { category: label } })}
      />
      <br />
    </>
  );
};
export default BudgetCategory;
