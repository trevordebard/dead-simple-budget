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
