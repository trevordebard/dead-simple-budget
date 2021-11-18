import NextAuth, { NextAuthOptions } from 'next-auth';
import prisma from 'lib/prismaClient';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import GoogleProvider from 'next-auth/providers/google';

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
};

export default NextAuth(options);
