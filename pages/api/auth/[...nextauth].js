import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  events: {
    createUser: async message => {
      console.log('yooooo');
      await prisma.budget.create({ data: { toBeBudgeted: 0, total: 0, user: { connect: { id: message.id } } } });
      console.log('budget created!');
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
