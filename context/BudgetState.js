import React, { useReducer } from 'react';
import budgetReducer from './budgetReducer';
import { sumBudget } from '../lib/budgetUtils';

const budget = [
  { category: 'Eating Out', value: 200 },
  { category: 'Bars', value: 100 },
  { category: 'Groceries', value: 250 },
];

const transactions = [
  { label: 'Podunk Bar LLC', category: 'Bars', amount: 30 },
  { label: `Restaurants R Us`, category: 'Eating Out', amount: 50 },
  { label: 'Walmart', category: 'Groceries', amount: 120 },
  { label: `Converted`, amount: 1000 },
  { label: `Ignore This Category`, category: 'ignore', amount: 3000 },
];
const initalState = {
  total: 2500,
  budget,
  toBeBudgeted: 2500 - budget.reduce(sumBudget, 0),
  transactions,
};
/**
 * TODO: ast minute thoughts
 * - Transactions should just have the ability to have not category. this is useful for importing your past transactions when you set up an acount so that
 * they do not impact your buckets.
 * - or "No Impact" could be a category for all imported transactions so that they don't impact budget
 * - or maybe just don't import old transactions ?? Leaning towards this...Need to revisit
 */
export const BudgetContext = React.createContext({ state: null, dispatch: null });

const BudgetState = props => {
  const [accountState, dispatch] = useReducer(budgetReducer, initalState);
  return <BudgetContext.Provider value={{ dispatch, state: accountState }}>{props.children}</BudgetContext.Provider>;
};

export default BudgetState;
