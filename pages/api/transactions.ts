import { deleteTransactions } from 'lib/api-helpers/deleteTransactions';
import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { iDeleteTransactionsInput } from 'types/transactions';

export default async function transactionsHanler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req);

  switch (method) {
    case 'GET':
      // Get data from your database
      const transactions = await getTransactions(user.id);
      res.status(200).json(transactions);
      break;
    case 'DELETE':
      let transactionIdInput: iDeleteTransactionsInput;
      try {
        transactionIdInput = JSON.parse(req.body);
      } catch (e) {
        transactionIdInput = req.body;
      }
      const deleteResponse = await deleteTransactions(transactionIdInput);
      res.status(200).json(deleteResponse);
      break;
    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getTransactions(userId: number) {
  return await prisma.transaction.findMany({ where: { userId } });
}
