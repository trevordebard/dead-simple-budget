import React, { useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';
import useInput from '../hooks/useInput';
import BudgetCategory from './BudgetCategory';
import useBudget from '../hooks/useBudget';

const Budget = () => {
  const { state, addCategory, updateAccountBalance } = useBudget();
  const { total, toBeBudgeted, budget } = state;
  const [totalSavings, onChangeTotalSavings] = useInput(total);
  const [newCategory, onChangeNewCategory, setNewCategory] = useInput('');
  const debouncedTotal = useDebounce(totalSavings, 1000);
  useEffect(() => {
    updateAccountBalance(debouncedTotal);
  }, [debouncedTotal, updateAccountBalance]);
  return (
    <div>
      Total: <input name="total" type="number" value={totalSavings} onChange={onChangeTotalSavings} />
      <p>To Be Budgeted: {toBeBudgeted}</p>
      {renderCategories(budget)}
      New Category: <input name="newCategory" type="text" value={newCategory} onChange={onChangeNewCategory} />
      <button
        type="button"
        onClick={() => {
          addCategory(newCategory);
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
