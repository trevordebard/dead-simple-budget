import { Stack } from '.prisma/client';
import { getUser } from 'lib/api-helpers/getUser';
import { recalcToBeBudgeted } from 'lib/api-helpers/recalcToBeBudgeted';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { iUpdateStackInput } from 'types/stack';

export default async function stackHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req);
  const stackId = parseInt(req.query.id as string);

  switch (method) {
    // TODO: Recalc to be budgeted
    case 'PUT':
      let updateInput: iUpdateStackInput;
      try {
        updateInput = JSON.parse(req.body);
      } catch (e) {
        updateInput = req.body;
      }
      let updateResponse: Stack;
      try {
        updateResponse = await updateStack(updateInput, stackId);
        await recalcToBeBudgeted(user);
      } catch (e) {
        if (e.code === 'P2002') {
          return res.status(400).json({ error: true, message: 'A stack with that label already exists.' });
        }
        return res.status(400).json({ error: true, message: 'An unknown error occurred' });
      }
      return res.status(200).json(updateResponse);
    case 'DELETE':
      const deleteResponse = await deleteStack(stackId);
      return res.status(200).json(deleteResponse);
    case 'GET':
      const getResponse = await getStackById(stackId);
      return res.status(200).json(getResponse);
    default:
      res.setHeader('Allow', ['PUT', 'DELETE', 'GET']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function updateStack(stack: iUpdateStackInput, stackId: number) {
  const existingStack = await prisma.stack.findUnique({ where: { id: stackId } });

  if (stack.stackCategoryId && existingStack.stackCategoryId !== stack.stackCategoryId) {
    await handleCategoryChanged(stack, existingStack.stackCategoryId);
  }
  return await prisma.stack.update({
    data: { ...stack },
    where: { id: stackId },
  });
}

async function deleteStack(stackId) {
  const deletedStack = await prisma.stack.delete({ where: { id: stackId } });
  await removeStackFromCategory(stackId, deletedStack.stackCategoryId);
  return deletedStack;
}
async function getStackById(stackId) {
  return await prisma.stack.findUnique({ where: { id: stackId } });
}

async function handleCategoryChanged(stack: iUpdateStackInput, oldCategoryId: number) {
  await removeStackFromCategory(stack.id, oldCategoryId);

  // Append stack to the new category
  return await prisma.stackCategory.update({
    where: { id: stack.stackCategoryId },
    data: { stackOrder: { push: stack.id } },
  });
}

// Removes stack from stack category order
async function removeStackFromCategory(stackId: number, categoryId: number) {
  const oldStackCategory = await prisma.stackCategory.findUnique({ where: { id: categoryId } });

  // Remove stack from previous stack category's ordering
  const removedOrder = oldStackCategory.stackOrder.filter(cat => cat !== stackId);
  return await prisma.stackCategory.update({ where: { id: categoryId }, data: { stackOrder: removedOrder } });
}
