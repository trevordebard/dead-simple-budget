import { z } from 'zod';
import { db } from '~/lib/db.server';
import { recalcToBeBudgeted } from '../budget';
import { EditTransactionSchema, NewTransactionSchema } from '../validation';

interface CreateTransactionInput extends z.infer<typeof NewTransactionSchema> {
  budgetId: string;
}

export async function createTransaction(transactionData: CreateTransactionInput) {
  const { amount } = transactionData;

  // Create transaction
  const createTransactionPromise = db.transaction.create({
    data: { ...transactionData, budgetId: transactionData.budgetId },
  });

  // Update budget total
  const updatedBudgetPromise = db.budget.update({
    where: {
      id: transactionData.budgetId,
    },
    data: {
      total: { increment: amount },
    },
  });

  // DB call could be a nested query, but there is no way at this time
  // to only pull back the created transaction from the prisma call.
  // For now it is better to run two db calls in a $transaction to have the
  // ability to return the newly created transaction in the function.

  // const budget = await db.budget.update({
  //   where: {
  //     id: transactionData.budgetId,
  //   },
  //   data: {
  //     total: { increment: amount },
  //     transactions: { create: { ...transactionData } },
  //   },
  // });

  const [transaction] = await db.$transaction([createTransactionPromise, updatedBudgetPromise]);
  await recalcToBeBudgeted({ budgetId: transaction.budgetId });

  return transaction;
}

type EditTransactionInput = z.infer<typeof EditTransactionSchema>;

// TODO: handle case where stack changes
export async function editTransaction(transaction: EditTransactionInput) {
  let { amount } = transaction;
  const { date, description, type } = transaction;

  if (transaction.type === 'withdrawal') {
    amount *= -1;
  }

  const existingTransaction = await db.transaction.findFirstOrThrow({ where: { id: transaction.id } });
  let diff = 0;

  // check if amount has changed
  if ((existingTransaction.amount || existingTransaction.amount === 0) && existingTransaction.amount !== amount) {
    diff = existingTransaction.amount - amount;
  }

  // check if stack has changed
  if (existingTransaction.stackId !== transaction.stackId) {
    // TODO: in the future when there are multiple budgets, how will changing the stack or amount impact old budgets?
    // idea: maybe there should be a "locked" flag on transactions. After
    // maybe there is a concept of a global stack balance and a monthly stack balance
    // anytime a transaction is added, it affects the global stack balance
    //  Basically each month your "allocated" amount resets, but your available amount is based on the global amount for that stack
    // allocated, in, out are monthly. available is based on monthly available + leftovers from previous month
  }

  await db.transaction.update({
    where: { id: transaction.id },
    data: {
      amount,
      date,
      description,
      type,
      budget: { connect: { id: existingTransaction.budgetId }, update: { total: { decrement: diff } } },
    },
  });

  await recalcToBeBudgeted({ budgetId: existingTransaction.budgetId });
}
