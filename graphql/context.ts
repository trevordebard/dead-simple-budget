import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/client';
import { Session } from 'next-auth';
import prisma from 'lib/prismaClient';
export interface Context {
  prisma: PrismaClient;
  session: Session;
}

export async function createContext({ req }): Promise<Context> {
  const session = await getSession({ req });
  return { prisma, session };
}
