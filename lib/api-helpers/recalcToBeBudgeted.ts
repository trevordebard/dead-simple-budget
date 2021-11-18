import { User } from '.prisma/client';
import prisma from 'lib/prismaClient';

export async function recalcToBeBudgeted(user: User) {
  const stackAggregation = await prisma.stack.aggregate({ _sum: { amount: true }, where: { userId: user.id } });
  const toBeBudgeted = user.total - stackAggregation._sum.amount;
  const updateResponse = await prisma.user.update({ where: { id: user.id }, data: { toBeBudgeted } });
  return updateResponse;
}
