import { user } from '.prisma/client';
import prisma from 'lib/prismaClient';
import { iDeleteTransactionsInput } from 'types/transactions';
import { recalcToBeBudgeted } from './recalcToBeBudgeted';

export async function deleteTransactions(input: iDeleteTransactionsInput, user: user) {
  if (!input.transactionIds || input.transactionIds.length < 1) {
    throw Error('No transactions provided to delete transactions function');
  }
  const transactionSum = await prisma.transaction.aggregate({
    where: { id: { in: input.transactionIds } },
    _sum: { amount: true },
  });
  await prisma.user.update({ where: { id: user.id }, data: { total: { decrement: transactionSum._sum.amount } } });
  const deleteResponse = await prisma.transaction.deleteMany({ where: { id: { in: input.transactionIds } } });
  await recalcToBeBudgeted(user);
  return deleteResponse;
}
