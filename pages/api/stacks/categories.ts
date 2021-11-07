import { StackCategory } from '.prisma/client';
import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function stackCategoriesHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  const user = await getUser(req);

  switch (method) {
    case 'GET':
      // Get data from your database
      const stackCategories = await getStackCategories(user.id);
      res.status(200).json(stackCategories);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// TODO: optimizations
async function getStackCategories(userId: number): Promise<StackCategory[]> {
  return await prisma.stackCategory.findMany({ where: { userId } });
}
