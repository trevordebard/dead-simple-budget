import { getUser } from 'lib/api-helpers/getUser';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { iUpdateUserTotalInput } from 'types/user';

export default async function stackHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req);
  const email = req.query.email as string;

  switch (method) {
    case 'GET':
      const userInfo = await getUserInfo(email);
      return res.status(200).json(userInfo);
    case 'PUT':
      // TODO: Recalc to be budgeted
      let updateInput: iUpdateUserTotalInput;
      try {
        updateInput = JSON.parse(req.body);
      } catch (e) {
        updateInput = req.body;
      }
      const updateResponse = await updateUserTotals(email, updateInput);
      return res.status(200).json(updateResponse);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getUserInfo(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function updateUserTotals(email: string, updateInput: iUpdateUserTotalInput) {
  return await prisma.user.update({
    data: { total: updateInput.total },
    where: { email },
  });
}
