import { useContext, useCallback } from 'react';
import { BudgetContext } from '../context/BudgetState';
import { BudgetActions } from '../context/budgetReducer';
import { getCategories } from '../lib/budgetUtils';

const useBudget = () => {
  const { state, dispatch } = useContext(BudgetContext);
  const addStack = category => {
    console.log(category);
    dispatch({ type: BudgetActions.ADD_STACK, payload: { category, value: 0 } });
  };
  // useCallback allows this to be called inside of useEffect without changing on ever render
  // https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies
  const updateAccountBalance = useCallback(
    total => {
      dispatch({ type: BudgetActions.UPDATE_TOTAL, payload: total });
    },
    [dispatch]
  );
  const updateStack = useCallback(
    (category, value) => {
      dispatch({ type: BudgetActions.UPDATE_STACK, payload: { category, value } });
    },
    [dispatch]
  );
  const getCategory = category => {
    const categoryIndex = state.stacks.findIndex(el => el?.category === category);
    return state.stacks[categoryIndex];
  };
  const removeStack = category => {
    dispatch({ type: BudgetActions.REMOVE_STACK, payload: { category } });
  };
  const categoryNames = getCategories(state.stacks);
  const addTransaction = (label, amount, category = 'unknown', date = null) => {
    dispatch({ type: BudgetActions.ADD_TRANSACTION, payload: { label, amount, category, date } });
  };
  return {
    state,
    addStack,
    updateAccountBalance,
    updateStack,
    removeStack,
    addTransaction,
    getCategory,
    categoryNames,
  };
};
export default useBudget;
