import React from 'react';
import useInput from '../hooks/useInput';
import BudgetCategory from './BudgetCategory';
import useBudget from '../hooks/useBudget';

const Budget = () => {
  const { state, addStack, updateAccountBalance } = useBudget();
  const { total, toBeBudgeted, stacks } = state;
  const [newCategory, onChangeNewCategory, setNewCategory] = useInput('');
  return (
    <div>
      Total: <input name="total" type="number" value={total} onChange={e => updateAccountBalance(e.target.value)} />
      <p style={{ color: 'red' }}>To Be Budgeted: {toBeBudgeted}</p>
      {renderCategories(stacks)}
      New Category: <input name="newCategory" type="text" value={newCategory} onChange={onChangeNewCategory} />
      <button
        type="button"
        onClick={() => {
          addStack(newCategory);
          setNewCategory('');
        }}
      >
        Add Category
      </button>
      <br />
    </div>
  );
};
function renderCategories(stacks) {
  return stacks.map(item => <BudgetCategory key={item.label} value={item.value} label={item.label} />);
}

export default Budget;
