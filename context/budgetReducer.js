import { sumBudget } from '../lib/budgetUtils';

export default (state, action) => {
  switch (action.type) {
    case 'updateTotal':
      return {
        ...state,
        total: action.payload,
        toBeBudgeted: action.payload - state.budget.reduce(sumBudget, 0),
      };
    case 'updateBudget': {
      console.log('updating budget');
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
};
