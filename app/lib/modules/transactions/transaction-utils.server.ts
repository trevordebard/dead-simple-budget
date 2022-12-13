import { z } from 'zod';
import { db } from '~/lib/db.server';
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

  return transaction;
}

type EditTransactionInput = z.infer<typeof EditTransactionSchema>;

export async function editTransaction(transaction: EditTransactionInput) {
  let { amount } = transaction;
  const { date, description, type } = transaction;

  if (transaction.type === 'withdrawal') {
    amount *= -1;
  }

  const existingTransaction = await db.transaction.findFirstOrThrow({ where: { id: transaction.id } });
  let diff = 0;

  if ((existingTransaction.amount || existingTransaction.amount === 0) && existingTransaction.amount !== amount) {
    diff = existingTransaction.amount - amount;
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
}
