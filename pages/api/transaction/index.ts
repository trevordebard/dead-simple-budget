import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { iCreateTransactionInput } from 'types/transactions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function transactionHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req);

  switch (method) {
    case 'POST':
      const addResponse = await createTransaction(user.id, req.body);
      res.status(200).json(addResponse);
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function createTransaction(userId: number, transaction: iCreateTransactionInput) {
  return await prisma.transaction.create({ data: { ...transaction, userId, date: new Date(transaction.date) } });
}
