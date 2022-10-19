import { Budget } from '@prisma/client';
import { db } from '~/lib/db.server';
import { recalcToBeBudgeted } from '../../budget/utils/budget.server';

export async function createStack(budgetId: Budget['id'], stack: { label: string }) {
  const { label } = stack;
  const newStack = await db.stack.create({
    data: {
      label,
      category: {
        connectOrCreate: {
          where: { label_budgetId: { label: 'Miscellaneous', budgetId } },
          create: { label: 'Miscellaneous', budgetId },
        },
      },
      budget: { connect: { id: budgetId } },
    },
  });
  return newStack;
}

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
