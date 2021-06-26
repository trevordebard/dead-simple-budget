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
      console.log(stackInput);
      const addResponse = await createStack(user.id, stackInput);
      res.status(200).json(addResponse);
      break;

    default:
      res.setHeader('Allow', ['POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function createStack(userId: number, stack: iCreateStackInput) {
  return await prisma.stack.create({ data: { ...stack, userId } });
}
