import { z } from 'zod';
import { db } from '~/lib/db.server';
import { EditTransactionSchema, NewTransactionSchema } from '../validation';

interface CreateTransactionInput extends z.infer<typeof NewTransactionSchema> {
  budgetId: string;
}

export async function createTransaction(transactionData: CreateTransactionInput) {
  // Create transaction
  const transaction = await db.transaction.create({
    data: transactionData,
  });

  return transaction;
}

type EditTransactionInput = z.infer<typeof EditTransactionSchema>;

export async function editTransaction(transaction: EditTransactionInput) {
  let { amount } = transaction;
  if (transaction.type === 'withdrawal') {
    amount *= -1;
  }
  await db.transaction.update({ where: { id: transaction.id }, data: { ...transaction, amount } });
}
