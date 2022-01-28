import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { iCreateStackInput } from 'types/stack';

export default async function stackHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req);

  switch (method) {
    case 'POST':
      let stackInput: iCreateStackInput;
      try {
        stackInput = JSON.parse(req.body);
      } catch (e) {
        stackInput = req.body;
      }
      const addResponse = await createStack(user.id, stackInput);
      res.status(200).json(addResponse);
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function createStack(userId: string, stack: iCreateStackInput) {
  // TODO: use connectOrCreate to create misc category if it does not exist
  let misc = await prisma.stackCategory.findFirst({ where: { userId, category: 'Miscellaneous' } });
  if (!misc) {
    misc = await prisma.stackCategory.create({ data: { userId, category: 'Miscellaneous', stackOrder: [] } });
  }
  const newStack = await prisma.stack.create({
    data: { ...stack, category: { connect: { id: misc.id } }, user: { connect: { id: userId } } },
  });

  // Add newly created stack to the bottom of the miscellaneous category
  await prisma.stackCategory.update({ where: { id: misc.id }, data: { stackOrder: { push: newStack.id } } });

  return newStack;
}