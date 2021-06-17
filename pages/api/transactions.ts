import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function transactionsHanler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req);

  switch (method) {
    case 'GET':
      // Get data from your database
      const transactions = await getTransactions(user.id);
      res.status(200).json(transactions);
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getTransactions(userId: number) {
  return await prisma.transaction.findMany({ where: { userId } });
}
