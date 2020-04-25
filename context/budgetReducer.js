import { sumBudget } from '../lib/budgetUtils';

export const BudgetActions = {
  UPDATE_TOTAL: 'updateTotal',
  UPDATE_CATEGORY: 'updateBudget',
  ADD_CATEGORY: 'addBudgetCategory',
  REMOVE_CATEGORY: 'removeBudgetCategory',
};
export default (state, action) => {
  switch (action.type) {
    case BudgetActions.UPDATE_TOTAL:
      return {
        ...state,
        total: action.payload,
        toBeBudgeted: action.payload - state.budget.reduce(sumBudget, 0),
      };
    case BudgetActions.UPDATE_CATEGORY: {
      const categoryIndex = state.budget.findIndex(el => el?.category === action?.payload?.category);
      const newBudget = [
        ...state.budget.slice(0, categoryIndex),
        { category: action.payload.category, value: action.payload.value },
        ...state.budget.slice(categoryIndex + 1),
      ];
      const toBeBudgeted = calcToBeBudgeted(newBudget, state);
      return {
        ...state,
        budget: newBudget,
        toBeBudgeted,
      };
    }
    case BudgetActions.ADD_CATEGORY:
      console.log(action);
      return {
        ...state,
        budget: [...state.budget, action.payload],
      };
    case BudgetActions.REMOVE_CATEGORY: {
      console.log(action);
      const newBudget = state.budget.filter(el => el.category !== action.payload.category);
      const toBeBudgeted = calcToBeBudgeted(newBudget, state);
      return {
        ...state,
        budget: newBudget,
        toBeBudgeted,
      };
    }
    default:
      return state;
  }
};

function calcToBeBudgeted(newBudget, state) {
  const moneyAllocated = newBudget.reduce(sumBudget, 0);
  console.log(moneyAllocated);
  const toBeBudgeted = state.total - moneyAllocated;
  return toBeBudgeted;
}
