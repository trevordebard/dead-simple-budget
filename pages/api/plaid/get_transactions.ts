import { NextApiRequest, NextApiResponse } from 'next';
import { format, sub } from 'date-fns';
import { plaidClient } from 'lib/plaidClient';
import { getSession } from 'next-auth/client';
import prismaClient from 'lib/prismaClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const userBankAccounts = await prismaClient.user.findUnique({
    where: { email: session.user.email },
    include: { bankAccounts: true },
  });

  const plaidAccessToken = userBankAccounts.bankAccounts[0].plaidAccessToken;

  let start = format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd');
  let end = format(new Date(), 'yyyy-MM-dd');

  const data = await plaidClient.getTransactions(plaidAccessToken, start, end);
  res.status(200).json(data.transactions);
}
