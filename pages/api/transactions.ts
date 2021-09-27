import { deleteTransactions } from 'lib/api-helpers/deleteTransactions';
import { getUser } from 'lib/api-helpers/getUser';
import { convertPlaidTransactionToPrismaInput } from 'lib/importTransactions';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from 'plaid';
import { iCreateManyTransactionsInput, iDeleteTransactionsInput } from 'types/transactions';

export default async function transactionsHanler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req);

  switch (method) {
    case 'POST':
      createManyTransactions(user.id, req.body);
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
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getTransactions(userId: number) {
  return await prisma.transaction.findMany({ where: { userId } });
}

async function createManyTransactions(userId: number, transactions: Transaction[]) {
  const input = transactions.map(transaction => convertPlaidTransactionToPrismaInput(transaction, userId));
  const response = await prisma.transaction.createMany({ data: input });
}

// Logic from grapqhl that can be reused
// async resolve(root, args, ctx, info, originalResolve) {
//   if (!ctx.session.user) {
//     throw Error('User not logged in');
//   }
//   const bankAccount = await ctx.prisma.bankAccout.findFirst({
//     where: { user: { email: info.variableValues.email } },
//   });
//   // Get transactions from latest date
//   if (bankAccount) {
//     const latestTransaction = await ctx.prisma.transaction.findMany({
//       where: { user: { email: info.variableValues.email } },
//       orderBy: { date: 'desc' },
//       take: 1,
//     });
//     let startDate;
//     if (latestTransaction.length < 1) {
//       startDate = format(new Date(), 'yyyy-MM-dd');
//     } else {
//       startDate = format(latestTransaction[0].date, 'yyyy-MM-dd');
//     }

//     // TODO: if this is the user's first time logging in, need to pull back lots of data.
//     // Maybe we should just import from join date forward and not grab history
//     // TODO: Set up logic to only import transactions if we haven't checked with plaid in last hour
//     await importTransactionsFromPlaid(startDate, bankAccount, ctx);
//   }
