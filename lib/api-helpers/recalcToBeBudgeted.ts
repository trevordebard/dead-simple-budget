import { user } from '.prisma/client';
import prisma from 'lib/prismaClient';

export async function recalcToBeBudgeted(user: user) {
  const stackAggregation = await prisma.stack.aggregate({ _sum: { amount: true }, where: { userId: user.id } });
  const toBeBudgeted = user.total - stackAggregation._sum.amount;
  const updateResponse = await prisma.user.update({ where: { id: user.id }, data: { toBeBudgeted } });
  console.log({ stackAggregation, toBeBudgeted, updateResponse });
  return updateResponse;
}
