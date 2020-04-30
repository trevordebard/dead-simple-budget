import { useContext, useCallback } from 'react';
import { BudgetContext } from '../context/BudgetState';
import { BudgetActions } from '../context/budgetReducer';
import { getStackLabels } from '../lib/budgetUtils';

const useBudget = () => {
  const { state, dispatch } = useContext(BudgetContext);
  const addStack = label => {
    dispatch({ type: BudgetActions.ADD_STACK, payload: { label, value: 0 } });
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
    (label, value) => {
      dispatch({ type: BudgetActions.UPDATE_STACK, payload: { label, value } });
    },
    [dispatch]
  );
  const getStack = label => {
    const labelIndex = state.stacks.findIndex(el => el?.label === label);
    return state.stacks[labelIndex];
  };
  const removeStack = label => {
    dispatch({ type: BudgetActions.REMOVE_STACK, payload: { label } });
  };
  const categoryNames = getStackLabels(state.stacks);

  const addTransaction = (description, amount, stackLabel = 'unknown', date = null) => {
    dispatch({ type: BudgetActions.ADD_TRANSACTION, payload: { description, amount, stackLabel, date } });
  };
  return {
    state,
    addStack,
    updateAccountBalance,
    updateStack,
    removeStack,
    addTransaction,
    getStack,
    categoryNames,
  };
};
export default useBudget;
