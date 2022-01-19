import { redirect } from 'remix';
import { Budget, Prisma } from '.prisma/client';
import { authenticator } from '~/auth/auth.server';
import { db } from '../db.server';
import { AuthenticatedUser } from '~/types/user';

export async function findOrCreateUser(email: string): Promise<AuthenticatedUser> {
  const user = await db.user.upsert({
    where: { email },
    create: { email, Budget: { create: { total: 0, toBeBudgeted: 0 } } },
    update: { email },
    include: { Budget: true },
  });
  // TODO: figure out type issue
  return user;
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const user = await authenticator.isAuthenticated(request);
  return user;
}

export async function requireAuthenticatedUser(request: Request): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request);
  if (!user) throw redirect('/login');
  return user;
}

export async function createStack(user: AuthenticatedUser, stack: { label: string }) {
  const { label } = stack;
  const newStack = await db.stack.create({
    data: {
      label,
      category: {
        connectOrCreate: {
          where: { label_budgetId: { label: 'Miscellaneous', budgetId: user.Budget.id } },
          create: { label: 'Miscellaneous', budgetId: user.Budget.id },
        },
      },
      budget: { connect: { id: user.Budget.id } },
    },
  });
  return newStack;
}

interface DeleteStackCategoryInput {
  categoryId: number;
  budgetId: string;
}
export async function deleteStackCateogry({ categoryId, budgetId }: DeleteStackCategoryInput) {
  const misc = await db.stackCategory.findFirst({
    where: { label: 'Miscellaneous', budgetId },
  });
  if (!misc) {
    throw Error('Cannot delete stack category if Miscellaneous category does not exist');
  }
  if (misc.id === categoryId) {
    throw Error('Cannot delete miscellaneous stack category');
  }

  // Change stacks within stack category to be in miscellaneous category
  await db.stack.updateMany({ where: { stackCategoryId: categoryId }, data: { stackCategoryId: misc.id } });
  await db.stackCategory.delete({ where: { id: categoryId } });
}

export async function recalcToBeBudgeted(budget: Budget) {
  const stackAggregation = await db.stack.aggregate({ _sum: { amount: true }, where: { budgetId: budget.id } });
  const sumOfStacks = stackAggregation._sum.amount || 0;
  const toBeBudgeted = budget.total - sumOfStacks;

  const updateResponse = await db.budget.update({
    where: { id: budget.id },
    data: { toBeBudgeted },
  });
  return updateResponse;
}

export async function createTransactionAndUpdBudget(
  transactionData: Prisma.TransactionUncheckedCreateInput,
  budgetId: string
) {
  const { amount, stackId } = transactionData;

  // Create transaction
  const createTransactionPromise = db.transaction.create({
    data: transactionData,
  });

  // Update stack amount
  const updateStackPromise = db.stack.update({
    where: { id: stackId },
    data: { amount: { increment: amount } },
  });

  // Update budget total
  const updatedBudget = await db.budget.update({
    where: {
      id: budgetId,
    },
    data: {
      total: { increment: amount },
    },
  });

  // Recalc to be budgeted
  const recalcToBeBudgetedPromise = recalcToBeBudgeted(updatedBudget);

  const [transaction, stack, recalcedBudget] = await Promise.all([
    createTransactionPromise,
    updateStackPromise,
    recalcToBeBudgetedPromise,
  ]);

  return transaction;
}
