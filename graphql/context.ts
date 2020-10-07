import { PrismaClient } from "@prisma/client";
import { getSession, Session } from 'next-auth/client'

const prisma = new PrismaClient({ log: ["query"] });


export interface Context {
    prisma: PrismaClient;
    session: Session
}

export async function createContext({ req }): Promise<Context> {
    const session = await getSession({ req })
    return { prisma, session };
}