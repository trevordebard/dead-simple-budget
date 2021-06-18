import prisma from 'lib/prismaClient';
import { iDeleteTransactionsInput } from 'types/transactions';

export async function deleteTransactions(input: iDeleteTransactionsInput) {
  if (!input.transactionIds || input.transactionIds.length < 1) {
    throw Error('No transactions provided to delete transactions function');
  }
  const deleteResponse = prisma.transaction.deleteMany({ where: { id: { in: input.transactionIds } } });
  return deleteResponse;
}
