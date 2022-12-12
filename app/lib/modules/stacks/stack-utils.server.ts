import { Budget } from '@prisma/client';
import { db } from '~/lib/db.server';

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
    await moveMoney({ to: stackId, amount: diff, budgetId: updatedStack.budgetId, moveType: 'FROM_TO_BE_BUDGETED' });
  }
  // if removing money from stack
  else if (updatedStack.amount > amount) {
    await moveMoney({ from: stackId, budgetId: updatedStack.budgetId, amount: diff, moveType: 'TO_TO_BE_BUDGETED' });
  }

  return updatedStack;
}

// TODO: in the future, type doesn't need to be explicit. It can be derived using typescript based on what values are provided
// Or if a type is provided, we can be more explicity about what fields are required given the type
interface iMoveMoneyInput {
  from?: string;
  to?: string;
  budgetId?: string;
  amount: number;
  moveType: 'TO_TO_BE_BUDGETED' | 'FROM_TO_BE_BUDGETED' | 'BETWEEN_STACKS';
}
export async function moveMoney(input: iMoveMoneyInput) {
  if (input.moveType === 'TO_TO_BE_BUDGETED') {
    if (!input.budgetId) {
      throw Error('Missing required field: budgetId');
    }
    if (!input.from) {
      throw Error('Missing required field: from');
    }
    // TODO: Promise.all
    const toBeBudgeted = await db.stack.update({
      where: { label_budgetId: { budgetId: input.budgetId, label: 'To Be Budgeted' } },
      data: { amount: { increment: input.amount } },
    });
    await db.stack.update({ data: { amount: { decrement: input.amount } }, where: { id: input.from } });
    await db.stackActivityLog.create({
      data: { amount: input.amount, fromStackId: input.from, toStackId: toBeBudgeted.id },
    });
  } else if (input.moveType === 'FROM_TO_BE_BUDGETED') {
    if (!input.budgetId) {
      throw Error('Missing required field: budgetId');
    }
    if (!input.to) {
      throw Error('Missing required field: to');
    }
    const toBeBudgeted = await db.stack.update({
      where: { label_budgetId: { budgetId: input.budgetId, label: 'To Be Budgeted' } },
      data: { amount: { decrement: input.amount } },
    });
    await db.stack.update({ data: { amount: { increment: input.amount } }, where: { id: input.to } });
    await db.stackActivityLog.create({
      data: { amount: input.amount, fromStackId: toBeBudgeted.id, toStackId: input.to },
    });
  } else {
    if (!input.to) {
      throw Error('Missing required field: to');
    }
    if (!input.from) {
      throw Error('Missing required field: from');
    }
    await db.stack.update({ data: { amount: { decrement: input.amount } }, where: { id: input.from } });
    await db.stack.update({ data: { amount: { increment: input.amount } }, where: { id: input.to } });
    await db.stackActivityLog.create({ data: { amount: input.amount, toStackId: input.to, fromStackId: input.from } });
  }
}
