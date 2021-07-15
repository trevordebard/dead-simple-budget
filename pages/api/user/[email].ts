import { getUser } from 'lib/api-helpers/getUser';
import { recalcToBeBudgeted } from 'lib/api-helpers/recalcToBeBudgeted';
import prisma from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { iUpdateUserTotalInput } from 'types/user';

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = await getUser(req);
  const email = req.query.email as string;

  switch (method) {
    case 'GET':
      return res.status(200).json(user);
    case 'PUT':
      // TODO: Recalc to be budgeted
      let updateInput: iUpdateUserTotalInput;
      try {
        updateInput = JSON.parse(req.body);
      } catch (e) {
        updateInput = req.body;
      }
      const updatedUser = await updateUserTotal(email, updateInput);
      const recalcToBeBudgetedResponse = await recalcToBeBudgeted(updatedUser);
      return res.status(200).json(recalcToBeBudgetedResponse);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function updateUserTotal(email: string, updateInput: iUpdateUserTotalInput) {
  return await prisma.user.update({
    data: { total: updateInput.total },
    where: { email },
  });
}
