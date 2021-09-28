import { BankAccout, Prisma, Transaction } from '@prisma/client';
import plaid from 'plaid';
import { format } from 'date-fns';
import { plaidClient } from 'lib/plaidClient';
import { User } from 'next-auth';
import prisma from './prismaClient';

export async function importTransactionsFromPlaid(startDate: string, bankAccount: BankAccout, user: User) {
  let end = format(new Date(), 'yyyy-MM-dd');
  const [year, month, day] = startDate.split('-');
  const start = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  const data = await plaidClient.getTransactions(bankAccount.plaidAccessToken, startDate, end, {
    account_ids: bankAccount.plaidAccountIds,
  });
  const fullUser = await prisma.user.findFirst({ where: { email: user.email } });
  let existingTransactions;
  existingTransactions = await prisma.transaction.findMany({ where: { date: { gte: start }, userId: fullUser.id } });
  const uniqueTransactions = getUniquePlaidTransactions(data.transactions, existingTransactions);
  const preparedTransactions = preparePlaidTransactionsForUpload(uniqueTransactions, fullUser.id);

  await prisma.transaction.createMany({ data: preparedTransactions });

  // TODO:
  return null;
}

export function getUniquePlaidTransactions(
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

export function convertPlaidTransactionToPrismaInput(
  transaction: plaid.Transaction,
  userId: number
): Prisma.TransactionCreateManyInput {
  const [year, month, day] = transaction.date.split('-');

  // deposits are negative in plaid and withdrawals are positive, so this will reverse that
  const amount = transaction.amount * -1;
  return {
    amount,
    description: transaction.name,
    date: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
    stack: 'Imported',
    type: amount < 0 ? 'withdrawal' : 'deposit', // TODO:
    userId: userId,
  };
}

function preparePlaidTransactionsForUpload(transactions: plaid.Transaction[], userId: number) {
  return transactions.map(transaction => convertPlaidTransactionToPrismaInput(transaction, userId));
}
