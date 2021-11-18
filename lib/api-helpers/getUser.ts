import prisma from 'lib/prismaClient';
import { NextApiRequest } from 'next';
// import { getSession } from 'next-auth/react';

export async function getUser(req: NextApiRequest) {
  // const session = await getSession({ req });
  const user = await prisma.user.findUnique({
    where: { email: process.env.EMAIL },
  });
  return user;
}
