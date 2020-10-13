import { makeSchema, objectType, mutationType, queryType } from '@nexus/schema';
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema';
import path from 'path';

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
    t.model.stacks();
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
const Query = queryType({
  definition(t) {
    t.crud.user();
    t.crud.budget();
    t.crud.transactions({ filtering: { user: true, userId: true } });
    t.crud.user();
    t.crud.budgets({ filtering: { user: true, userId: true } });
    t.crud.stacks();
  },
});

const Mutation = mutationType({
  definition(t) {
    t.crud.createOneuser();
    t.crud.createOnebudget();
    t.crud.updateOnebudget({
      async resolve(root, args, ctx, info, originalResolve) {
        const res = await originalResolve(root, args, ctx, info);
        const {
          sum: { amount: sumOfStacks },
        } = await ctx.prisma.stacks.aggregate({ sum: { amount: true } });
        const { total } = await ctx.prisma.budget.findOne({ where: { id: res.id } });
        await ctx.prisma.budget.update({ data: { toBeBudgeted: { set: total - sumOfStacks } }, where: { id: res.id } });
        return res;
      },
    });
    t.crud.updateOnestacks({
      async resolve(root, args, ctx, info, originalResolve) {
        const res = await originalResolve(root, args, ctx, info);
        const {
          sum: { amount: sumOfStacks },
        } = await ctx.prisma.stacks.aggregate({ sum: { amount: true }, where: { budgetId: { equals: res.budgetId } } });
        const { total } = await ctx.prisma.budget.findOne({ where: { id: res.budgetId } });
        await ctx.prisma.budget.update({
          data: { toBeBudgeted: { set: total - sumOfStacks } },
          where: { id: res.budgetId },
        });
        return res;
      },
    });
    t.crud.createOnestacks();
    t.crud.createOnetransactions({
      async resolve(root, args, ctx, info, originalResolve) {
        const res = await originalResolve(root, args, ctx, info);
        const { budget } = await ctx.prisma.user.findOne({
          where: { id: res.userId },
          include: { budget: true },
        });
        await ctx.prisma.stacks.update({
          data: { amount: { increment: res.amount } },
          where: { budgetId_label_idx: { budgetId: budget.id, label: res.stack } },
        });
        await ctx.prisma.budget.update({
          data: { toBeBudgeted: { increment: args.data.amount } },
          where: { id: budget.id },
        });
        return res;
      },
    });
    t.crud.updateOnetransactions({
      async resolve(root, args, ctx, info, originalResolve) {
        const transactionBefore = await ctx.prisma.transactions.findOne({ where: { id: args.where.id } });
        const res = await originalResolve(root, args, ctx, info);
        const difference = transactionBefore.amount - res.amount;
        const { budget } = await ctx.prisma.user.findOne({
          where: { id: res.userId },
          include: { budget: true },
        });
        await ctx.prisma.stacks.update({
          data: { amount: difference },
          where: { budgetId_label_idx: { budgetId: budget.id, label: res.stack } },
        });
        await ctx.prisma.budget.update({
          data: { toBeBudgeted: { increment: difference } },
          where: { id: budget.id },
        });
        return res;
      },
    });
  },
});
export const schema = makeSchema({
  types: { Query, Budget, Transactions, Stacks, User, Mutation },
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
