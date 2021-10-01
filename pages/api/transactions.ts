import { deleteTransactions } from 'lib/api-helpers/deleteTransactions';
import { getUser } from 'lib/api-helpers/getUser';
import { recalcToBeBudgeted } from 'lib/api-helpers/recalcToBeBudgeted';
import { convertPlaidTransactionToPrismaInput } from 'lib/importTransactions';
import { dollarsToCents } from 'lib/money';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { Transaction as PlaidTransaction } from 'plaid';
import { iCreateManyTransactionsInput, iDeleteTransactionsInput } from 'types/transactions';

export default async function transactionsHanler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req);

  switch (method) {
    case 'POST':
      const createResponse = await createManyTransactions(user.id, req.body);
      res.status(200).json(createResponse);
      break;
    case 'GET':
      // Get data from database
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
      const deleteResponse = await deleteTransactions(transactionIdInput, user);
      res.status(200).json(deleteResponse);
      break;
    default:
      res.setHeader('Allow', ['GET', 'DELETE', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getTransactions(userId: number) {
  return await prisma.transaction.findMany({ where: { userId } });
}

async function createManyTransactions(userId: number, transactions: PlaidTransaction[]) {
  let sum = 0;
  const input = transactions.map(transaction => {
    // deposits are negative in plaid and withdrawals are positive, so this will reverse that while also summing in cents
    sum += dollarsToCents(transaction.amount * -1);
    return convertPlaidTransactionToPrismaInput(transaction, userId);
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { total: { increment: sum } },
  });
  await recalcToBeBudgeted(updatedUser);
  const response = await prisma.transaction.createMany({ data: input });
  return response;
}
