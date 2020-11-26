import { Prisma } from '@prisma/client';
import * as csv from 'fast-csv';
import { Context } from 'nexus-plugin-prisma/typegen';
import { recalcToBeBudgeted } from 'graphql/schema';

// Converts transaction readstream to array of transaction objects
async function parseTransactionCsv(createReadStream, ctx: Context): Promise<Prisma.transactionsCreateInput[]> {
  return new Promise((resolve, reject) => {
    const res = [];
    createReadStream()
      .pipe(
        csv.parse({ delimiter: ',', headers: headers => headers.map(h => h?.toLowerCase()), ltrim: true, rtrim: true })
      )
      .on('error', error => reject(error))
      .on('data', row => {
        const transaction: Prisma.transactionsCreateInput = {
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

export async function importTransactions(createReadStream, ctx: Context) {
  // Convert transaction CSV to array of transactions
  const transactions = await parseTransactionCsv(createReadStream, ctx);
  let sumOfTransactions = 0;
  // Create list of prisma calls which will create a transaction (i.e. our data model, "transaction";
  // not to be confused with the prisma call, "$transaction")
  // Tracking https://github.com/prisma/prisma-client-js/issues/332 for native prisma batch create
  const prismaCalls = transactions.map(transaction => {
    sumOfTransactions += transaction.amount;
    return ctx.prisma.transactions.create({
      data: transaction,
    });
  });
  try {
    // Attempt running all prismaCalls. If one call fails, the others will be rolled back
    const results = await ctx.prisma.$transaction(prismaCalls);

    // Get user budget given the user id from one of the responses
    const { budget } = await ctx.prisma.user.findUnique({
      where: { id: results[0].userId },
      include: { budget: true },
    });
    console.log(sumOfTransactions);
    // Update increment budget total by sum of all transactions imported
    await ctx.prisma.budget.update({
      data: { total: { increment: sumOfTransactions } },
      where: { id: budget.id },
    });
    await recalcToBeBudgeted(ctx.prisma, budget.id);
  } catch (e) {
    console.error('Error inserting transaction batch!');
    throw e;
  }
}
