import React, { useEffect, useContext } from 'react';
import { BudgetContext } from '../context/GlobalState';
import useDebounce from '../hooks/useDebounce';
import useInput from '../hooks/useInput';
import BudgetCategory from './BudgetCategory';

const Budget = () => {
  const { state, dispatch } = useContext(BudgetContext);
  const { total, toBeBudgeted, budget } = state;
  const [totalSavings, onChangeTotalSavings] = useInput(total);
  const [newCategory, onChangeNewCategory, setNewCategory] = useInput('');
  const debouncedTotal = useDebounce(totalSavings, 1000);
  useEffect(() => {
    dispatch({ type: 'updateTotal', payload: debouncedTotal });
  }, [debouncedTotal, dispatch]);
  return (
    <div>
      Total: <input name="total" type="number" value={totalSavings} onChange={onChangeTotalSavings} />
      <p>To Be Budgeted: {toBeBudgeted}</p>
      {renderCategories(budget)}
      New Category: <input name="newCategory" type="text" value={newCategory} onChange={onChangeNewCategory} />
      <button
        type="button"
        onClick={() => {
          dispatch({ type: 'addBudgetCategory', payload: { category: newCategory, value: 0 } });
          setNewCategory('');
        }}
      >
        Add Category
      </button>
    </div>
  );
};
function renderCategories(budget) {
  return budget.map(item => <BudgetCategory key={item.category} value={item.value} label={item.category} />);
}

export default Budget;
