import { NextApiRequest, NextApiResponse } from 'next';
import { DateTime } from 'luxon';
import { plaidClient } from 'lib/plaidClient';
import { getSession } from 'next-auth/client';
import prismaClient from 'lib/prismaClient';
import { getUniquePlaidTransactions } from 'lib/importTransactions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const user = await prismaClient.user.findUnique({
    where: { email: session.user.email },
    include: { bankAccounts: true },
  });

  const latestTransaction = await prismaClient.transaction.findMany({
    where: { user: { email: user.email } },
    orderBy: { date: 'desc' },
    take: 1,
  });

  const plaidAccessToken = user.bankAccounts[0].plaidAccessToken;

  // Only fetch transactions on or after the day of the most recent transaction already saved
  let start = DateTime.fromJSDate(latestTransaction[0].date).toFormat('yyyy-MM-dd');
  let end = DateTime.now().toFormat('yyyy-MM-dd');

  const plaidResponse = await plaidClient.getTransactions(plaidAccessToken, start, end);
  const plaidTransactions = plaidResponse.transactions;

  let existingTransactions = await prismaClient.transaction.findMany({
    where: { date: { gte: latestTransaction[0].date }, userId: user.id },
  });

  const uniqueTransactions = getUniquePlaidTransactions(plaidTransactions, existingTransactions);

  res.status(200).json(uniqueTransactions);
}
