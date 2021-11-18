import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { iEditTransactionInput } from 'types/transactions';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '.prisma/client';
import { recalcToBeBudgeted } from 'lib/api-helpers/recalcToBeBudgeted';
import { DateTime } from 'luxon';

export default async function transactionByIdHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;
  const transactionId = parseInt(id as string);
  const user = await getUser(req);

  switch (method) {
    case 'PUT':
      const editResponse = await editTransaction(user, parseInt(id as string), req.body);
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

async function editTransaction(user: User, transactionId: number, transaction: iEditTransactionInput) {
  // TODO: this could be simplified into less db calls

  // Reset total to amounts prior to previous transaction
  const prevTransaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
  await prisma.user.update({
    where: { id: user.id },
    data: { total: { decrement: prevTransaction.amount } },
  });

  // Update transaction and user total with new transaction amount
  const updatedTransaction = await prisma.transaction.update({
    data: { ...transaction, date: DateTime.fromFormat(transaction.date, 'yyyy-MM-dd').toISO() },
    where: { id: transactionId },
  });
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { total: { increment: transaction.amount } },
  });

  // Only update stack amount if transaction is changing from imported to a definted stack
  // This is an intentional decision to not update stack amounts for every transaction edit.
  // In the future, it may make sense to update for every transaction edit. I'm not sure
  // what a user would generally expect.
  if (prevTransaction.stack === 'Imported') {
    await prisma.stack.update({
      where: { label_userId: { userId: user.id, label: transaction.stack } },
      data: { amount: { increment: transaction.amount } },
    });
  }

  await recalcToBeBudgeted(updatedUser);

  return updatedTransaction;
}
async function getTransactionById(transactionId: number) {
  return await prisma.transaction.findUnique({ where: { id: transactionId } });
}
