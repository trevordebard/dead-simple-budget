import { StackCategory } from '.prisma/client';
import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { iUpdateStackCategoryInput } from 'types/stack';

export default async function stackCatByIdHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req); // checks auth
  const stackCatId = parseInt(req.query.id as string);

  switch (method) {
    case 'GET':
      const stackCategory = await getStackCategory(stackCatId);
      return res.status(200).json(stackCategory);

    case 'PUT':
      let updateInput: iUpdateStackCategoryInput;
      try {
        updateInput = JSON.parse(req.body);
      } catch (e) {
        updateInput = req.body;
      }
      let updateResponse: StackCategory;
      try {
        updateResponse = await updateStackCategory(stackCatId, updateInput);
      } catch (e) {
        console.error(e);
        return res.status(400).json({ error: true, message: 'An unknown error occurred' });
      }
      return res.status(200).json(updateResponse);
    case 'DELETE':
      let deleteResponse;
      try {
        deleteResponse = await deleteStackCategory(user.id, stackCatId);
      } catch (e) {
        console.error(e);
        return res.status(400).json({ error: true, message: 'An unknown error occurred' });
      }
      return res.status(200).json(deleteResponse);
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function updateStackCategory(stackCatId: number, stackCategory: iUpdateStackCategoryInput) {
  return await prisma.stackCategory.update({ where: { id: stackCatId }, data: { ...stackCategory } });
}

async function getStackCategory(stackCatId: number) {
  return await prisma.stackCategory.findUnique({ where: { id: stackCatId } });
}

async function deleteStackCategory(userId: string, stackCatId: number) {
  let misc = await prisma.stackCategory.findFirst({ where: { userId, category: 'Miscellaneous' } });
  if (misc.id === stackCatId) {
    throw Error('Cannot delete miscellaneous stack category');
  }

  // Change stacks within stack category to be in miscellaneous category
  await prisma.stack.updateMany({ where: { stackCategoryId: stackCatId }, data: { stackCategoryId: misc.id } });
  return await prisma.stackCategory.delete({ where: { id: stackCatId } });
}
