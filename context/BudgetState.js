import React, { useReducer } from 'react';
import budgetReducer from './budgetReducer';

export const BudgetContext = React.createContext({ state: null, dispatch: null });

const BudgetState = props => {
  const { initialState } = props;
  const [accountState, dispatch] = useReducer(budgetReducer, initialState[0]);
  return <BudgetContext.Provider value={{ dispatch, state: accountState }}>{props.children}</BudgetContext.Provider>;
};

export default BudgetState;
