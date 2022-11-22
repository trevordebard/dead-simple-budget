import { Budget } from '@prisma/client';
import { db } from '../../db.server';

type RecalcInput = { budget?: Budget; budgetId?: string };
export async function recalcToBeBudgeted(input: RecalcInput) {
  const { budget: budgetInput, budgetId } = input;

  let budget: Budget | null = null;

  if (budgetId) {
    budget = await db.budget.findUnique({ where: { id: budgetId } });
  } else if (budgetInput) {
    budget = budgetInput;
  }

  if (!budget) {
    throw Error('Invalid input. Budget or budgetId required');
  }

  const stackAggregation = await db.stack.aggregate({
    _sum: { amount: true },
    where: { budgetId: budget.id, AND: { label: { not: 'To Be Budgeted' } } },
  });
  const sumOfStacks = stackAggregation._sum.amount || 0;
  const toBeBudgeted = budget.total - sumOfStacks;

  const toBeBudgetedStack = await db.stack.update({
    where: { label_budgetId: { budgetId: budget.id, label: 'To Be Budgeted' } },
    data: { amount: toBeBudgeted },
  });
  return toBeBudgetedStack;
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
