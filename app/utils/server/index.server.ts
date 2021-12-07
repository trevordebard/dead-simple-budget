import { redirect } from 'remix';
import { Transaction } from '.prisma/client';
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

export async function createTransaction(data: Transaction) {
  const newTrans = await db.transaction.createMany({ data });
  return newTrans;
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
