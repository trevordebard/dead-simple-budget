import { StackCategory } from '.prisma/client';
import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { iCategorizedStack, iGetStacksOptions } from 'types/stack';

export default async function stacksHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  const user = await getUser(req);

  switch (method) {
    case 'GET':
      const options: iGetStacksOptions = query;
      // Get data from your database
      const stacks = await getStacks(user.id, options);
      res.status(200).json(stacks);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getStacks(userId: string, options: iGetStacksOptions = null) {
  if (options?.organizeBy === 'category') {
    return getStacksByCategory(userId);
  }
  return await prisma.stack.findMany({ where: { userId }, include: { category: true } });
}

// TODO: optimizations
async function getStacksByCategory(userId: string): Promise<iCategorizedStack[]> {
  const categories: StackCategory[] = await prisma.stackCategory.findMany({
    where: { userId },
    orderBy: { id: 'asc' },
  });

  const categorizedStacks = await Promise.all(
    categories.map(async cat => {
      const stacks = await prisma.stack.findMany({ where: { userId, stackCategoryId: cat.id } });

      stacks.sort(function (a, b) {
        return cat.stackOrder.indexOf(a.id) - cat.stackOrder.indexOf(b.id);
      });
      return {
        category: cat.category,
        stacks: stacks,
        id: cat.id,
      };
    })
  );
  return categorizedStacks;
}
