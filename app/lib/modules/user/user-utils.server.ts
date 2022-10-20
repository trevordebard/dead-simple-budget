import { Prisma, User } from '@prisma/client';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/lib/modules/auth/auth.server';
import { db } from '../../db.server';

export async function getAuthenticatedUser(request: Request): Promise<User | null> {
  const user = await authenticator.isAuthenticated(request);
  return user;
}

export async function requireAuthenticatedUser(request: Request): Promise<User> {
  const user = await getAuthenticatedUser(request);
  if (!user) throw redirect('/login');
  return user;
}

export async function findOrCreateUser(email: string): Promise<User> {
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return existingUser;
  }
  const newUser = await createUser(email);
  return newUser;
}

async function createUser(email: string) {
  const user = await db.user.create({
    data: {
      email,
      Budget: {
        create: {
          total: 0,
          toBeBudgeted: 0,
          stackCategories: {
            createMany: {
              data: [
                { label: 'Necessities', position: 10 },
                { label: 'Fun Money', position: 20 },
              ],
            },
          },
        },
      },
    },
    include: { Budget: { include: { stackCategories: true } } },
  });

  if (!user.Budget) {
    // this should never happen
    throw Error('No budget found for user');
  }

  // Create stacks for the newly created stack categories
  const newStackPromises: Promise<Prisma.BatchPayload>[] = [];
  user.Budget.stackCategories.forEach((category) => {
    if (category.label === 'Necessities') {
      newStackPromises.push(
        db.stack.createMany({
          data: [
            { label: 'Rent', stackCategoryId: category.id, budgetId: category.budgetId, position: 10 },
            { label: 'Groceries', stackCategoryId: category.id, budgetId: category.budgetId, position: 20 },
            { label: 'Car Insurance', stackCategoryId: category.id, budgetId: category.budgetId, position: 30 },
          ],
        })
      );
    } else if (category.label === 'Fun Money') {
      newStackPromises.push(
        db.stack.createMany({
          data: [
            { label: 'Eating Out', stackCategoryId: category.id, budgetId: category.budgetId, position: 10 },
            { label: 'Vacation', stackCategoryId: category.id, budgetId: category.budgetId, position: 20 },
            { label: 'Online Purchases', stackCategoryId: category.id, budgetId: category.budgetId, position: 30 },
          ],
        })
      );
    }
  });

  await Promise.all(newStackPromises);

  return user;
}
