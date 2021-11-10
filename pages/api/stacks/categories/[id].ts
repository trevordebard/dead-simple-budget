import { StackCategory } from '.prisma/client';
import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { iUpdateStackCategoryInput } from 'types/stack';

export default async function stackCatByIdHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await getUser(req); // checks auth
  const stackCatId = parseInt(req.query.id as string);

  switch (method) {
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

    default:
      res.setHeader('Allow', ['PUT']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function updateStackCategory(stackCatId: number, stackCategory: iUpdateStackCategoryInput) {
  return await prisma.stackCategory.update({ where: { id: stackCatId }, data: { ...stackCategory } });
}
