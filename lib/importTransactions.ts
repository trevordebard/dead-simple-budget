import { BankAccout, Prisma, Transaction } from '@prisma/client';
import plaid from 'plaid';
import * as csv from 'fast-csv';
import { Context } from '../graphql/context';
import { format } from 'date-fns';
import { plaidClient } from 'lib/plaidClient';
// Converts transaction readstream to array of transaction objects
async function parseTransactionCsv(createReadStream, ctx: Context): Promise<Prisma.TransactionCreateInput[]> {
  return new Promise((resolve, reject) => {
    const res = [];
    createReadStream()
      .pipe(
        csv.parse({
          delimiter: ',',
          headers: headers => headers.map(h => h?.toLowerCase()),
          ltrim: true,
          rtrim: true,
        })
      )
      .on('error', error => reject(error))
      .on('data', row => {
        const transaction: Prisma.TransactionCreateInput = {
          amount: parseFloat(row.amount),
          date: new Date(row.date),
          description: row.description,
          stack: 'Imported',
          type: row.type.toLowerCase(),
          user: { connect: { email: ctx.session.user.email } },
        };
        res.push(transaction);
      })
      .on('end', () => resolve(res));
  });
}

function removeExistingTransactions(
  newTransactions: Prisma.TransactionCreateInput[],
  existingTransactions: Transaction[]
): Prisma.TransactionCreateInput[] {
  const uniqueResultOne = newTransactions.filter(
    newTrasaction =>
      !existingTransactions.some(
        existing =>
          newTrasaction.amount === existing.amount &&
          newTrasaction.description === existing.description &&
          new Date(newTrasaction.date).getTime() === existing.date.getTime() &&
          newTrasaction.type === existing.type
      )
  );
  return uniqueResultOne;
}

export async function importTransactionsFromPlaid(startDate: string, bankAccount: BankAccout, ctx: Context) {
  let end = format(new Date(), 'yyyy-MM-dd');
  const [year, month, day] = startDate.split('-');
  const start = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  const data = await plaidClient.getTransactions(bankAccount.plaidAccessToken, startDate, end, {
    account_ids: bankAccount.plaidAccountIds,
  });
  const user = await ctx.prisma.user.findFirst({ where: { email: ctx.session.user.email } });
  let existingTransactions;
  existingTransactions = await ctx.prisma.transaction.findMany({ where: { date: { gte: start }, userId: user.id } });
  const uniqueTransactions = getUniquePlaidTransactions(data.transactions, existingTransactions);
  const preparedTransactions = preparePlaidTransactionsForUpload(uniqueTransactions, user.id);

  await ctx.prisma.transaction.createMany({ data: preparedTransactions });

  // TODO:
  return null;
}

function getUniquePlaidTransactions(
  plaidTransactions: plaid.Transaction[],
  existingTransactions: Transaction[]
): plaid.Transaction[] {
  const uniquePlaidTransactions = plaidTransactions.filter(
    newTrasaction =>
      !existingTransactions.some(
        existing =>
          // TODO: we should probably just store the plaid item id and see if already exists! This will help if the user edits the description
          // checking absolute value in case user edits transaction to be a deposit/withdrawal
          Math.abs(newTrasaction.amount) === Math.abs(existing.amount) && newTrasaction.name === existing.description
      )
  );
  return uniquePlaidTransactions;
}

function convertPlaidTransactionToPrismaInput(
  transaction: plaid.Transaction,
  userId: number
): Prisma.TransactionCreateManyInput {
  const [year, month, day] = transaction.date.split('-');
  return {
    // deposits are negative in plaid and withdrawals are positive, so this will reverse that
    amount: transaction.amount * -1,
    description: transaction.name,
    date: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
    stack: 'Imported',
    type: transaction.amount < 0 ? 'withdrawal' : 'deposit', // TODO:
    userId: userId,
  };
}

function preparePlaidTransactionsForUpload(transactions: plaid.Transaction[], userId: number) {
  return transactions.map(transaction => convertPlaidTransactionToPrismaInput(transaction, userId));
}
