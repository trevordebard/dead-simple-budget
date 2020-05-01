import { sumStacks } from '../lib/budgetUtils';

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
        toBeBudgeted: action.payload - state.stacks.reduce(sumStacks, 0),
      };
    case BudgetActions.UPDATE_STACK: {
      const labelIndex = state.stacks.findIndex(el => el?.label === action?.payload?.label);
      const newStacks = [
        ...state.stacks.slice(0, labelIndex),
        { _id: state.stacks[labelIndex]._id, label: action.payload.label, value: action.payload.value },
        ...state.stacks.slice(labelIndex + 1),
      ];
      const toBeBudgeted = calcToBeBudgeted(newStacks, state);
      return {
        ...state,
        stacks: newStacks,
        toBeBudgeted,
      };
    }
    case BudgetActions.ADD_STACK:
      return {
        ...state,
        stacks: [...state.stacks, action.payload],
      };
    case BudgetActions.REMOVE_STACK: {
      const newStacks = state.stacks.filter(el => el.label !== action.payload.label);
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
      const { description, amount, stackLabel, date } = action.payload;
      const newStacks = state.stacks.map(el => {
        if (el.label === stackLabel) {
          return { ...el, value: el.value - amount };
        }
        return el;
      });
      return {
        ...state,
        stacks: newStacks,
        total: state.total - amount,
        transactions: [...state.transactions, { description, amount, date, stackLabel }],
      };
    }
    default:
      return state;
  }
};

function calcToBeBudgeted(newStacks, state) {
  const moneyAllocated = newStacks.reduce(sumStacks, 0);
  const toBeBudgeted = state.total - moneyAllocated;
  return toBeBudgeted;
}
