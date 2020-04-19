import React, { useReducer } from 'react';

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
const initalState = {
  total: 2500,
  budget,
};

const GlobalState = props => {
  console.log('placeholder');
  const [accountState, dispatch] = useReducer(budgetReducer, initalState);
  return (
    <BudgetDispatchContext.Provider value={{ dispatch, accountState }}>{props.children}</BudgetDispatchContext.Provider>
  );
};

export default GlobalState;
