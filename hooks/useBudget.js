import { useContext, useCallback } from 'react';
import { BudgetContext } from '../context/BudgetState';
import { BudgetActions } from '../context/budgetReducer';

const useBudget = () => {
  const { state, dispatch } = useContext(BudgetContext);
  const addCategory = category => {
    dispatch({ type: 'addBudgetCategory', payload: { category, value: 0 } });
  };
  // useCallback allows this to be called inside of useEffect without changing on ever render
  // https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies
  const updateAccountBalance = useCallback(
    total => {
      dispatch({ type: BudgetActions.UPDATE_TOTAL, payload: total });
    },
    [dispatch]
  );

  const updateBudgetCategory = useCallback(
    (category, value) => {
      dispatch({ type: BudgetActions.UPDATE_CATEGORY, payload: { category, value: value || 0 } });
    },
    [dispatch]
  );
  const removeCategory = category => {
    dispatch({ type: BudgetActions.REMOVE_CATEGORY, payload: { category } });
  };
  return { state, dispatch, addCategory, updateAccountBalance, updateBudgetCategory, removeCategory };
};
export default useBudget;
