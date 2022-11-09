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

  const stackAggregation = await db.stack.aggregate({ _sum: { amount: true }, where: { budgetId: budget.id } });
  const sumOfStacks = stackAggregation._sum.amount || 0;
  const toBeBudgeted = budget.total - sumOfStacks;

  const updateResponse = await db.budget.update({
    where: { id: budget.id },
    data: { toBeBudgeted },
  });
  return updateResponse;
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
  let targetStack;
  if (!input.to) {
    await db.stack.update({ data: { amount: { decrement: input.amount } }, where: { id: input.from } });
    await db.budget.update({ data: { toBeBudgeted: { increment: input.amount } }, where: { id: input.budgetId } });

    // const toBeBudgeted = await db.stack.findUnique({
    //   where: { label_budgetId: { label: 'To Be Budgeted', budgetId: input.budgetId } },
    // });
    // if (!toBeBudgeted) {
    //   throw Error('This should never happen');
    // }
    // targetStack = toBeBudgeted.id;
  } else {
    targetStack = input.to;
    await db.stack.update({ data: { amount: { decrement: input.amount } }, where: { id: input.from } });
    await db.stack.update({ data: { amount: { increment: input.amount } }, where: { id: targetStack } });
  }
}
