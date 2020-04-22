import { useContext } from 'react';
import { BudgetContext } from '../context/BudgetState';

const useBudget = () => {
  const { state, dispatch } = useContext(BudgetContext);
  return { state, dispatch };
};
export default useBudget;
