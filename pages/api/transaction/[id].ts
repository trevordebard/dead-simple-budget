import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { iEditTransactionInput } from 'types/transactions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function transactionHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  const user = await getUser(req);

  switch (method) {
    case 'PUT':
      const editResponse = await editTransaction(user.id, parseInt(id as string), req.body);
      res.status(200).json(editResponse);
      break;

    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function editTransaction(userId: number, transactionId: number, transaction: iEditTransactionInput) {
  return await prisma.transaction.update({
    data: { ...transaction, date: new Date(transaction.date) },
    where: { id: transactionId },
  });
}
