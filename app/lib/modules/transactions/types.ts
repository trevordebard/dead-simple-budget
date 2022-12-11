import { Prisma } from '@prisma/client';

export type tSpendingSummary = (Prisma.PickArray<Prisma.TransactionGroupByOutputType, 'stackId'[]> & {
  _sum: {
    amount: number | null;
  };
})[];
