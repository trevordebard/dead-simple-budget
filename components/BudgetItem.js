import React, { useContext, useEffect } from 'react';
import useInput from '../hooks/useInput';
import { BudgetContext } from '../context/GlobalState';
import useDebounce from '../hooks/useDebounce';

const BudgetItem = ({ label, value }) => {
  const [total, changeTotal] = useInput(value);
  const { dispatch } = useContext(BudgetContext);
  const debouncedTotal = useDebounce(total, 1000);

  useEffect(() => {
    dispatch({ type: 'updateBudget', payload: { category: label, value: debouncedTotal || 0 } });
  }, [dispatch, label, debouncedTotal]);
  return (
    <>
      <label htmlFor={label}>
        {label}: <input id={label} type="number" value={total} onChange={changeTotal} />
      </label>
      <br />
    </>
  );
};
export default BudgetItem;
