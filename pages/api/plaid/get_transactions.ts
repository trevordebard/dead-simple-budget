import { NextApiRequest, NextApiResponse } from 'next';
import { DateTime } from 'luxon';
import { plaidClient } from 'lib/plaidClient';
import { getSession } from 'next-auth/client';
import prismaClient from 'lib/prismaClient';
import { getUniquePlaidTransactions } from 'lib/importTransactions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const dateRange = parseInt(req.query.dateRange as string); // Time in days to look back

  const user = await prismaClient.user.findUnique({
    where: { email: session.user.email },
    include: { bankAccounts: true },
  });

  const plaidAccessToken = user.bankAccounts[0].plaidAccessToken;

  // Only fetch transactions on or after the day of the most recent transaction already saved
  let start = DateTime.now().minus({ days: dateRange });
  let end = DateTime.now().toFormat('yyyy-MM-dd');

  const plaidResponse = await plaidClient.getTransactions(plaidAccessToken, start.toFormat('yyyy-MM-dd'), end, {
    account_ids: user.bankAccounts[0].plaidAccountIds,
    count: 500,
  });
  const plaidTransactions = plaidResponse.transactions;

  // TODO: if the plaidTransactions length is > 500, the query needs to be broken up into smaller date chunks to be able to get all of the transactions
  // plaid lemits the getTransactions request to have a max of 500.

  let existingTransactions = await prismaClient.transaction.findMany({
    where: { date: { gte: start.toJSDate() }, plaidTransactionId: { not: null }, userId: user.id },
  });

  const uniqueTransactions = getUniquePlaidTransactions(plaidTransactions, existingTransactions);

  res.status(200).json(uniqueTransactions);
}
