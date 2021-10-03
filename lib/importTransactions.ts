import { Prisma, Transaction } from '@prisma/client';
import { DateTime } from 'luxon';
import plaid from 'plaid';
import { dollarsToCents } from './money';

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
          Math.abs(dollarsToCents(newTrasaction.amount)) === Math.abs(existing.amount) &&
          newTrasaction.name === existing.description
      )
  );
  return uniquePlaidTransactions;
}

export function convertPlaidTransactionToPrismaInput(
  transaction: plaid.Transaction,
  userId: number
): Prisma.TransactionCreateManyInput {
  const [year, month, day] = transaction.date.split('-');

  let amount = dollarsToCents(transaction.amount);
  // deposits are negative in plaid and withdrawals are positive, so this will reverse that
  amount = amount * -1;
  return {
    amount,
    description: transaction.name,
    date: DateTime.fromFormat(transaction.date, 'yyyy-MM-dd').toJSDate(),
    stack: 'Imported',
    type: amount < 0 ? 'withdrawal' : 'deposit', // TODO:
    userId: userId,
  };
}

function preparePlaidTransactionsForUpload(transactions: plaid.Transaction[], userId: number) {
  return transactions.map(transaction => convertPlaidTransactionToPrismaInput(transaction, userId));
}
