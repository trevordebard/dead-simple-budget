import { Budget } from '@prisma/client';
import { db } from '~/lib/db.server';
import { moveMoney } from '../budget/budget-utils.server';

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
  amount: number;
  label: string;
  categoryId?: string;
};

export async function updateStack(data: UpdateFields) {
  const { stackId, categoryId, label, amount } = data;
  const updatedStack = await db.stack.update({
    where: { id: stackId },
    data: { label, stackCategoryId: categoryId },
    include: { budget: true },
  });
  let diff = updatedStack.amount - Math.abs(amount);
  diff = Math.abs(diff);

  // if adding money to the stack
  if (updatedStack.amount < amount) {
    moveMoney({ to: stackId, amount: diff, budgetId: updatedStack.budgetId, moveType: 'FROM_TO_BE_BUDGETED' });
  }
  // if removing money from stack
  else if (updatedStack.amount > amount) {
    moveMoney({ from: stackId, budgetId: updatedStack.budgetId, amount: diff, moveType: 'TO_TO_BE_BUDGETED' });
  }

  return updatedStack;
}
