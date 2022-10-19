import { db } from '../db.server';
import { recalcToBeBudgeted } from '../modules/budget/utils/budget.server';

type UpdateFields = {
  stackId: string;
  amount?: number;
  label?: string;
  categoryId?: string;
};

type UpdateOptions = {
  recalcToBeBudgeted?: boolean;
};
export async function updateStack(data: UpdateFields, options: UpdateOptions = { recalcToBeBudgeted: true }) {
  const { stackId, categoryId, label, amount } = data;
  const updatedStack = await db.stack.update({
    where: { id: stackId },
    data: { amount, label, stackCategoryId: categoryId },
    include: { budget: true },
  });
  if (options.recalcToBeBudgeted) {
    await recalcToBeBudgeted({ budget: updatedStack.budget });
  }
  return updatedStack;
}
