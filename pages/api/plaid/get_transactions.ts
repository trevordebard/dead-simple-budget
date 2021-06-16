import { NextApiRequest, NextApiResponse } from 'next';
import { format, sub } from 'date-fns';
import { plaidClient } from 'lib/plaidClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let start = format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd');
  let end = format(new Date(), 'yyyy-MM-dd');

  const data = await plaidClient.getTransactions(req.query.accessToken as string, start, end);
  res.status(200).json(data);
}
