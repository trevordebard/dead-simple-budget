import { StackCategory } from '.prisma/client';
import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { iCreateStackCategoryInput } from 'types/stack';

export default async function stackCategoriesHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  const user = await getUser(req);

  switch (method) {
    case 'GET':
      // Get data from your database
      const stackCategories = await getStackCategories(user.id);
      res.status(200).json(stackCategories);
      break;

    case 'POST':
      let categoryInput: iCreateStackCategoryInput;
      try {
        categoryInput = JSON.parse(req.body);
      } catch (e) {
        categoryInput = req.body;
      }
      let stackCategory;
      try {
        stackCategory = await createStackCategory(user.id, categoryInput);
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: true, message: 'An unknown error occurred' });
      }
      res.status(200).json(stackCategory);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

async function getStackCategories(userId: string): Promise<StackCategory[]> {
  return await prisma.stackCategory.findMany({ where: { userId } });
}

async function createStackCategory(userId: string, category: iCreateStackCategoryInput) {
  return await prisma.stackCategory.create({ data: { ...category, userId } });
}
