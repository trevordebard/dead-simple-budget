import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { iEditTransactionInput } from 'types/transactions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function transactionByIdHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;
  const transactionId = parseInt(id as string);
  const user = await getUser(req);

  switch (method) {
    case 'PUT':
      const editResponse = await editTransaction(user.id, parseInt(id as string), req.body);
      res.status(200).json(editResponse);
      break;
    case 'GET':
      const getResponse = await getTransactionById(transactionId);
      return res.status(200).json(getResponse);
    default:
      res.setHeader('Allow', ['PUT', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function editTransaction(userId: number, transactionId: number, transaction: iEditTransactionInput) {
  return await prisma.transaction.update({
    data: { ...transaction, date: new Date(transaction.date) },
    where: { id: transactionId },
  });
}
async function getTransactionById(transactionId: number) {
  return await prisma.transaction.findUnique({ where: { id: transactionId } });
}
