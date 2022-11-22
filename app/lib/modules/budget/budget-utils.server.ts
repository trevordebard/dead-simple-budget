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

interface MoveMoneyBase {
  from: string;
  amount: number;
}

interface MoveMoneyWithBudgetIdInput extends MoveMoneyBase {
  to?: never;
  budgetId: string;
}
interface MoveMoneyWithStackIdInput extends MoveMoneyBase {
  to: string;
  budgetId: never;
}

type MoveMoneyInput = MoveMoneyWithBudgetIdInput | MoveMoneyWithStackIdInput;

export async function moveMoney(input: MoveMoneyInput) {
  if (!input.to) {
    // TODO: Promise.all
    const toBeBudgeted = await db.stack.update({
      where: { label_budgetId: { budgetId: input.budgetId, label: 'To Be Budgeted' } },
      data: { amount: { increment: input.amount } },
    });
    await db.stack.update({ data: { amount: { decrement: input.amount } }, where: { id: input.from } });
    await db.stackActivityLog.create({
      data: { amount: input.amount, fromStackId: input.from, toStackId: toBeBudgeted.id },
    });
  } else {
    await db.stack.update({ data: { amount: { decrement: input.amount } }, where: { id: input.from } });
    await db.stack.update({ data: { amount: { increment: input.amount } }, where: { id: input.to } });
    await db.stackActivityLog.create({ data: { amount: input.amount, toStackId: input.to, fromStackId: input.from } });
  }
}
