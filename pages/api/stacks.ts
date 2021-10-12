import { deleteTransactions } from 'lib/api-helpers/deleteTransactions';
import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function stacksHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req);

  switch (method) {
    case 'GET':
      // Get data from your database
      const stacks = await getStacks(user.id);
      res.status(200).json(stacks);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getStacks(userId: number) {
  return await prisma.stack.findMany({ where: { userId } });
}
