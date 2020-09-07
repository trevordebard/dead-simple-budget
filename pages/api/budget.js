import { PrismaClient } from 'nexus-plugin-prisma';

const prisma = new PrismaClient();

export default async (req, res) => {
  const test = await prisma.budget.findMany({ where: { userId: 1 } });
  console.log(test);
  res.statusCode = 200;
  res.send(JSON.stringify(test));
};

export const config = {
  api: {
    bodyParser: false,
  },
};
