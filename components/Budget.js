import React, { useState, useReducer, useEffect, useContext } from 'react';

const budget = [
  { category: 'Eating Out', value: 200 },
  { category: 'Phone', value: 100 },
  { category: 'Rent', value: 900 },
];
const sumBudget = (acc, el) => acc + parseInt(el.value);
function budgetReducer(state, action) {
  switch (action.type) {
    case 'field':
      console.log(action.field);
      if (action.field !== 'total') {
        return {
          ...state,
          [action.field]: action.value,
        };
      }
      return {
        ...state,
        [action.field]: [action.value],
      };
    case 'updateTotal':
      return {
        ...state,
        total: action.payload,
        toBeBudgeted: action.payload - state.budget.reduce(sumBudget, 0),
      };
    case 'updateBudget': {
      const categoryIndex = state.budget.findIndex(el => el?.category === action?.payload?.category);
      const newBudget = [
        ...state.budget.slice(0, categoryIndex),
        { category: action.payload.category, value: action.payload.value },
        ...state.budget.slice(categoryIndex + 1),
      ];
      const moneyAllocated = newBudget.reduce(sumBudget, 0);
      console.log(moneyAllocated);
      const toBeBudgeted = state.total - moneyAllocated;
      return {
        ...state,
        budget: newBudget,
        toBeBudgeted,
      };
    }
    default:
      return state;
  }
}
const BudgetDispatchContext = React.createContext();
const initialState = {
  total: 2500,
  budget,
};

const Budget = () => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);
  const { total, toBeBudgeted, budget } = state;
  const debouncedTotal = useDebounce(total, 1000);
  const onChange = e => {
    dispatch({ type: 'field', field: e.currentTarget.name, value: e.currentTarget.value });
  };
  useEffect(() => {
    console.log('updated ');
    dispatch({ type: 'updateTotal', payload: debouncedTotal });
  }, [debouncedTotal]);
  return (
    <BudgetDispatchContext.Provider value={dispatch}>
      <h1>Budget</h1>
      <label htmlFor="total">
        Total: <input name="total" type="number" value={total} onChange={onChange} />
      </label>
      <p>To Be Budgeted: {toBeBudgeted}</p>
      <br />
      {budget.map(category => (
        <BudgetItem value={category.value} label={category.category} />
      ))}
    </BudgetDispatchContext.Provider>
  );
};

const BudgetItem = ({ label, value }) => {
  const [total, changeTotal] = useInput(value || '');
  const dispatch = useContext(BudgetDispatchContext);
  const test = useDebounce(total, 1000);

  useEffect(() => {
    dispatch({ type: 'updateBudget', payload: { category: label, value: test } });
  }, [dispatch, label, test]);
  return (
    <>
      <label htmlFor={label}>
        {label}: <input id={label} type="number" value={total} onChange={changeTotal} />
      </label>
      <br />
    </>
  );
};
// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}
export const useInput = init => {
  const [input, setInput] = useState(init);
  const handleInputChange = e => setInput(e.currentTarget.value);
  return [input, handleInputChange];
};

export default Budget;
