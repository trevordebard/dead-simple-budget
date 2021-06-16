import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters';
import prisma from 'lib/prismaClient';

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
      // TODO: This causes prisma error. I am hoping a future update will fix the error
      try {
        await prisma.budget.create({ data: { total: 0, toBeBudgeted: 0, user: { connect: { id: message.id } } } });
        // await prisma.$executeRaw(
        //   `INSERT INTO budget("total", "toBeBudgeted", "userId") VALUES (${0}, ${0}, ${message.id})`
        // );
      } catch (e) {
        console.error(e);
        console.error('Unable to add budget!');
      }
    },
  },
};

export default NextAuth(options);
