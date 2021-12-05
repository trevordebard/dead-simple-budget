import { Transaction } from ".prisma/client";
import { authenticator } from "~/auth/auth.server";
import { db } from "../db.server";
import { redirect } from 'remix'
import { AuthenticatedUser } from "~/types/user";


export async function findOrCreateUser(email: string): Promise<AuthenticatedUser> {
  const user = await db.user.upsert({ where: { email }, create: { email, Budget: { create: { total: 0, toBeBudgeted: 0 } } }, update: { email }, include: { Budget: true } })
  // TODO: figure out type issue
  return user;
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const user = await authenticator.isAuthenticated(request);
  return user;
}

export async function requireAuthenticatedUser(request: Request): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request)
  if (!user) throw redirect('/login')
  return user;
}

export async function createStack(user: AuthenticatedUser, stack: { label: string }) {
  const { label } = stack
  return await db.stack.create({ data: { label, category: { connectOrCreate: { where: { label_budgetId: { label: "Miscellaneous", budgetId: user.Budget.id } }, create: { label: "Miscellaneous", budgetId: user.Budget.id } } }, budget: { connect: { id: user.Budget.id } } } })
}

export async function createTransaction(data: Transaction) {
  return await db.transaction.createMany({ data })
}