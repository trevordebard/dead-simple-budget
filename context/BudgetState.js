import React, { useReducer } from 'react';
import budgetReducer from './budgetReducer';
import { sumBudget } from '../lib/budgetUtils';

const budget = [
  { category: 'Eating Out', value: 200 },
  { category: 'Phone', value: 100 },
  { category: 'Rent', value: 900 },
];
const initalState = {
  total: 2500,
  budget,
  toBeBudgeted: budget.reduce(sumBudget, 0),
};
export const BudgetContext = React.createContext({ state: null, dispatch: null });

const BudgetState = props => {
  const [accountState, dispatch] = useReducer(budgetReducer, initalState);

  return <BudgetContext.Provider value={{ dispatch, state: accountState }}>{props.children}</BudgetContext.Provider>;
};

export default BudgetState;
