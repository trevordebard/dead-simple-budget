import React, { useReducer } from 'react';
import budgetReducer from './budgetReducer';

// TODO: Refactor to be UserState
export const BudgetContext = React.createContext({ state: null, dispatch: null });

const BudgetState = props => {
  const { initialState } = props;
  console.log('hi');
  const [accountState, dispatch] = useReducer(
    budgetReducer,
    // TODO: pass in user state here to no longer need this data manipulation
    {
      ...initialState.budget,
      transactions: initialState.transactions,
    }
  );
  return <BudgetContext.Provider value={{ dispatch, state: accountState }}>{props.children}</BudgetContext.Provider>;
};

export default BudgetState;
