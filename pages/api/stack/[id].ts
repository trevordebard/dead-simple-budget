import { Stack } from '.prisma/client';
import { getUser } from 'lib/api-helpers/getUser';
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
      } catch (e) {
        if (e.code === 'P2002') {
          return res.status(400).json({ error: true, message: 'A stack with that label already exists.' });
        }
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
  return await prisma.stack.update({
    data: { ...stack },
    where: { id: stackId },
  });
}

async function deleteStack(stackId) {
  return await prisma.stack.delete({ where: { id: stackId } });
}
async function getStackById(stackId) {
  return await prisma.stack.findUnique({ where: { id: stackId } });
}
