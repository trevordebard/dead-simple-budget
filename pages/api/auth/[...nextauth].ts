import NextAuth, { NextAuthOptions } from 'next-auth';
import prisma from 'lib/prismaClient';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
