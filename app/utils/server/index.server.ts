import { Budget } from '@prisma/client';
import { Prisma } from '.prisma/client';
import { db } from '../db.server';
import { recalcToBeBudgeted } from './budget.server';

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

// TODO: derive these types from the prsimamodel
interface DeleteStackCategoryInput {
  categoryId: string;
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

export async function createTransactionAndUpdBudget(
  transactionData: Prisma.TransactionUncheckedCreateInput,
  budgetId: string
) {
  const { amount, stackId } = transactionData;

  // Create transaction
  const createTransactionPromise = db.transaction.create({
    data: transactionData,
  });

  // TODO: the below database calls should probably be done in a $transaction

  // Update stack amount
  let updateStackPromise;
  let updatedBudgetPromise;
  if (stackId) {
    updateStackPromise = db.stack.update({
      where: { id: stackId },
      data: { amount: { increment: amount }, budget: { update: { total: { increment: amount } } } },
      include: { budget: true },
    });
  } else {
    // Only update budget total
    updatedBudgetPromise = db.budget.update({
      where: {
        id: budgetId,
      },
      data: {
        total: { increment: amount },
      },
    });
  }

  const [transaction, stack, updatedBudget] = await Promise.all([
    createTransactionPromise,
    updateStackPromise,
    updatedBudgetPromise,
  ]);

  // Recalc to be budgeted
  if (updatedBudget) {
    await recalcToBeBudgeted({ budget: updatedBudget });
  } else if (stack?.budget) {
    await recalcToBeBudgeted({ budget: stack.budget });
  }

  return transaction;
}

const EditTransInput = Prisma.validator<Prisma.TransactionArgs>()({
  select: {
    id: true,
    amount: true,
    description: true,
    stackId: true,
    budget: true,
    type: true,
    date: true,
  },
});

type EditTransactionInput = Prisma.TransactionGetPayload<typeof EditTransInput>;

export async function editTransactionAndUpdBudget(transaction: EditTransactionInput) {
  const { description, id: transactionId, stackId, budget, type, date } = transaction;
  let { amount } = transaction;
  // Get the previous transaction
  const prevTransaction = await db.transaction.findFirst({
    where: { id: transactionId, budget: { id: budget.id } },
  });

  if (!prevTransaction || !budget) {
    throw Error('TODO');
  }

  if (type === 'withdrawal') {
    amount *= -1;
  }

  // Reset previous stack amount by previous transaction amount
  let resetStackPromise;
  if (prevTransaction.stackId) {
    resetStackPromise = db.stack.update({
      where: { id: prevTransaction.stackId },
      data: { amount: { decrement: prevTransaction.amount } },
    });
  } else {
    // this is a useless call just to satisfy the $transaction type requirements below
    resetStackPromise = db.stack.findFirst({});
  }

  // Reset budget total by previous transaction amount
  const resetBudgetPromise = db.budget.update({
    where: { id: budget.id },
    data: { total: { decrement: prevTransaction.amount } },
  });

  // Update transaction
  const updateTransactionPromise = db.transaction.update({
    where: { id: transactionId },
    data: { amount, description, stackId, type, date },
  });

  // Increment/decrement stack by new amount
  let updateStackPromise;
  if (stackId) {
    updateStackPromise = db.stack.update({
      where: { id: stackId },
      data: { amount: { increment: amount } },
    });
  } else {
    // this is a useless call just to satisfy the $transaction type requirements below
    updateStackPromise = db.stack.findFirst({});
  }

  // Increment/decrement budget total by new amount
  const updateBudgetPromise = db.budget.update({
    where: { id: budget.id },
    data: { total: { increment: amount } },
  });

  const [_a, _b, _c, _d, updatedBudget] = await db.$transaction([
    resetStackPromise,
    resetBudgetPromise,
    updateTransactionPromise,
    updateStackPromise,
    updateBudgetPromise,
  ]);

  // Recalc to be budgeteds
  await recalcToBeBudgeted({ budget: updatedBudget });
}
