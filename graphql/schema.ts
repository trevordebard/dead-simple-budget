import { makeSchema, objectType, mutationType, queryType, arg } from '@nexus/schema';
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Upload, UploadFile } from 'graphql/Upload';
import { importTransactions } from 'lib/importTransactions';

const User = objectType({
  name: 'user',
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.budget();
    t.model.transactions();
  },
});

const Budget = objectType({
  name: 'budget',
  definition(t) {
    t.model.id();
    t.model.toBeBudgeted();
    t.model.total();
    t.model.userId();
    t.model.stacks({ ordering: true });
  },
});

const Transactions = objectType({
  name: 'transactions',
  definition(t) {
    t.model.amount();
    t.model.description();
    t.model.id();
    t.model.stack();
    t.model.type();
    t.model.userId();
    t.model.date();
  },
});

const Stacks = objectType({
  name: 'stacks',
  definition(t) {
    t.model.id();
    t.model.label();
    t.model.amount();
    t.model.budgetId();
    t.model.created_at();
  },
});
export const File = objectType({
  name: 'File',
  definition(t) {
    t.id('id');
    t.string('path');
    t.string('filename');
    t.string('mimetype');
    t.string('encoding');
  },
});

const Query = queryType({
  definition(t) {
    t.crud.user();
    t.crud.budget();
    t.crud.transactions({ filtering: { user: true, userId: true }, ordering: { date: true } });
    t.crud.budgets({ filtering: { user: true, userId: true } });
    t.crud.stacks();
  },
});

const Mutation = mutationType({
  definition(t) {
    t.field('uploadFile', {
      type: 'UploadFile',
      args: {
        file: arg({ type: 'Upload' }),
      },
      resolve: async (_root, args, ctx) => {
        const { createReadStream, filename } = await args.file;
        await importTransactions(createReadStream, ctx);
        return {
          filename,
        };
      },
    });
    t.crud.createOneuser();
    t.crud.deleteManytransactions({
      async resolve(root, args, ctx, info, originalResolve) {
        // Sum transactions being deleted
        const sum = await ctx.prisma.transactions.aggregate({
          sum: { amount: true },
          where: { id: { in: args.where.id.in } },
        });
        const res = await originalResolve(root, args, ctx, info);

        // Get budget
        const { budget } = await ctx.prisma.user.findUnique({
          where: { email: ctx.session.user.email },
          include: { budget: true },
        });

        // Update total
        await ctx.prisma.budget.update({
          // using negative amount becuase if the amount is negative, we want to increment total since that amount is being deleted
          data: { total: { increment: -sum.sum.amount } },
          where: { id: budget.id },
        });
        await recalcToBeBudgeted(ctx.prisma, budget.id);
        return res;
      },
    });
    t.crud.createOnebudget();
    t.crud.updateOnebudget({
      async resolve(root, args, ctx, info, originalResolve) {
        const res = await originalResolve(root, args, ctx, info);
        await recalcToBeBudgeted(ctx.prisma, res.id);
        return res;
      },
    });
    t.crud.updateOnestacks({
      async resolve(root, args, ctx, info, originalResolve) {
        const res = await originalResolve(root, args, ctx, info);
        await recalcToBeBudgeted(ctx.prisma, res.budgetId);
        return res;
      },
    });
    t.crud.createOnestacks();
    t.crud.createOnetransactions({
      async resolve(root, args, ctx, info, originalResolve) {
        const res = await originalResolve(root, args, ctx, info);
        const { budget } = await ctx.prisma.user.findUnique({
          where: { id: res.userId },
          include: { budget: true },
        });
        await ctx.prisma.stacks.update({
          data: { amount: { increment: res.amount } },
          where: { budgetId_label_idx: { budgetId: budget.id, label: res.stack } },
        });
        await ctx.prisma.budget.update({
          data: { total: { increment: res.amount } },
          where: { id: budget.id },
        });
        await recalcToBeBudgeted(ctx.prisma, budget.id);
        return res;
      },
    });
    t.crud.updateOnetransactions({
      async resolve(root, args, ctx, info, originalResolve) {
        const transactionBefore = await ctx.prisma.transactions.findUnique({ where: { id: args.where.id } });
        const res = await originalResolve(root, args, ctx, info);
        const difference = transactionBefore.amount - res.amount;
        const { budget } = await ctx.prisma.user.findUnique({
          where: { id: res.userId },
          include: { budget: true },
        });
        await ctx.prisma.stacks.update({
          data: { amount: { increment: difference } },
          where: { budgetId_label_idx: { budgetId: budget.id, label: res.stack } },
        });
        await recalcToBeBudgeted(ctx.prisma, budget.id);
        return res;
      },
    });
  },
});
export const schema = makeSchema({
  types: { Query, Budget, Transactions, Stacks, User, Mutation, Upload, UploadFile },
  plugins: [nexusSchemaPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), 'schema.graphql'),
    typegen: path.join(process.cwd(), 'nexus.ts'),
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
  },
});

export async function recalcToBeBudgeted(prisma: PrismaClient, budgetId: number) {
  const {
    sum: { amount: sumOfStacks },
  } = await prisma.stacks.aggregate({ sum: { amount: true }, where: { budgetId: { equals: budgetId } } });
  const { total } = await prisma.budget.findUnique({ where: { id: budgetId } });
  await prisma.budget.update({
    data: { toBeBudgeted: { set: total - sumOfStacks } },
    where: { id: budgetId },
  });
}
