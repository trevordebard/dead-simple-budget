import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { iCreateTransactionInput } from 'types/transactions';
import { NextApiRequest, NextApiResponse } from 'next';
import { recalcToBeBudgeted } from 'lib/api-helpers/recalcToBeBudgeted';
import { User } from '.prisma/client';
import { DateTime } from 'luxon';

export default async function transactionHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req);

  switch (method) {
    case 'POST':
      const addResponse = await createTransaction(user, req.body);
      res.status(200).json(addResponse);
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function createTransaction(user: User, transaction: iCreateTransactionInput) {
  await prisma.stack.update({
    where: { label_userId: { userId: user.id, label: transaction.stack } },
    data: { amount: { increment: transaction.amount } },
  });
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { total: { increment: transaction.amount } },
  });
  const date = DateTime.fromFormat(transaction.date, 'yyyy-MM-dd').toISO();
  const createResponse = await prisma.transaction.create({
    data: { ...transaction, userId: user.id, date },
  });
  await recalcToBeBudgeted(updatedUser);
  return createResponse;
}