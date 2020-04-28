import React from 'react';
import useInput from '../hooks/useInput';
import BudgetCategory from './BudgetCategory';
import useBudget from '../hooks/useBudget';

const Budget = () => {
  const { state, addCategory, updateAccountBalance } = useBudget();
  const { total, toBeBudgeted, budget } = state;
  const [newCategory, onChangeNewCategory, setNewCategory] = useInput('');
  return (
    <div>
      Total: <input name="total" type="number" value={total} onChange={e => updateAccountBalance(e.target.value)} />
      <p style={{ color: 'red' }}>To Be Budgeted: {toBeBudgeted}</p>
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
      <br />
    </div>
  );
};
function renderCategories(budget) {
  return budget.map(item => <BudgetCategory key={item.category} value={item.value} label={item.category} />);
}

export default Budget;
