import React, { useEffect, useContext } from 'react';
import { BudgetContext } from '../context/GlobalState';
import useDebounce from '../hooks/useDebounce';
import useInput from '../hooks/useInput';
import BudgetItem from './BudgetItem';

const Budget = () => {
  const { state, dispatch } = useContext(BudgetContext);
  const { total, toBeBudgeted, budget } = state;
  const [totalSavings, setTotalSavings] = useInput(total);
  const debouncedTotal = useDebounce(totalSavings, 1000);
  useEffect(() => {
    dispatch({ type: 'updateTotal', payload: debouncedTotal });
  }, [debouncedTotal, dispatch]);
  return (
    <div>
      <label htmlFor="total">
        Total: <input name="total" type="number" value={totalSavings} onChange={setTotalSavings} />
      </label>
      <p>To Be Budgeted: {toBeBudgeted}</p>
      {budget.map(category => (
        <BudgetItem key={category.category} value={category.value} label={category.category} />
      ))}
    </div>
  );
};

export default Budget;
