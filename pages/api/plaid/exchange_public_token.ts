import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { plaidClient } from 'lib/plaidClient';
import prisma from 'lib/prismaClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: redirect if user is not logged in
  const session = await getSession({ req });
  const data = await plaidClient.exchangePublicToken(req.query.publicToken as string);

  // add bank account and access token to db
  const accountsResponse = await plaidClient.getAccounts(data.access_token);
  const accountIds = accountsResponse.accounts
    .filter(account => account.type === 'depository' && account.subtype === 'checking')
    .map(acct => acct.account_id);

  await prisma.bankAccout.create({
    data: {
      plaidAccessToken: data.access_token,
      plaidItemId: data.item_id,
      plaidAccountIds: accountIds,
      user: { connect: { email: session.user.email } },
    },
  });
  res.status(200).json(data);
}
