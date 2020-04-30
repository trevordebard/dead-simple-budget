import { sumBudget } from '../lib/budgetUtils';

export const BudgetActions = {
  UPDATE_TOTAL: 'updateTotal',
  UPDATE_STACK: 'updateBudget',
  ADD_STACK: 'addBudgetCategory',
  REMOVE_STACK: 'removeBudgetCategory',
  ADD_TRANSACTION: 'addTransaction',
};
export default (state, action) => {
  switch (action.type) {
    case BudgetActions.UPDATE_TOTAL:
      return {
        ...state,
        total: action.payload,
        toBeBudgeted: action.payload - state.stacks.reduce(sumBudget, 0),
      };
    case BudgetActions.UPDATE_STACK: {
      const categoryIndex = state.stacks.findIndex(el => el?.category === action?.payload?.category);
      const newStacks = [
        ...state.stacks.slice(0, categoryIndex),
        { category: action.payload.category, value: action.payload.value },
        ...state.stacks.slice(categoryIndex + 1),
      ];
      const toBeBudgeted = calcToBeBudgeted(newStacks, state);
      return {
        ...state,
        stacks: newStacks,
        toBeBudgeted,
      };
    }
    case BudgetActions.ADD_STACK:
      console.log(state);
      return {
        ...state,
        stacks: [...state.stacks, action.payload],
      };
    case BudgetActions.REMOVE_STACK: {
      const newStacks = state.stacks.filter(el => el.category !== action.payload.category);
      const toBeBudgeted = calcToBeBudgeted(newStacks, state);
      return {
        ...state,
        stacks: newStacks,
        toBeBudgeted,
      };
    }
    case BudgetActions.ADD_TRANSACTION: {
      // 1. Update category with current amount +/- transaction amount
      // 2. Update amount in savings with +/- transaction amount
      // TODO: 3. Append transaction to transactions array
      const { category, label, amount, date } = action.payload;
      const newStacks = state.stacks.map(el => {
        console.log(el);
        if (el.category === category) {
          console.log(el.category);
          return { ...el, value: el.value - amount };
        }
        return el;
      });
      return {
        ...state,
        stacks: newStacks,
        total: state.total - amount,
        transactions: [...state.transactions, { label, amount, date, category }],
      };
    }
    default:
      return state;
  }
};

function calcToBeBudgeted(newStacks, state) {
  const moneyAllocated = newStacks.reduce(sumBudget, 0);
  console.log(moneyAllocated);
  const toBeBudgeted = state.total - moneyAllocated;
  return toBeBudgeted;
}
