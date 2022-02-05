import { Budget } from '@prisma/client';
import { db } from '../db.server';

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
