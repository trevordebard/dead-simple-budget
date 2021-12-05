import { Budget, Transaction, User } from ".prisma/client";
import { authenticator } from "~/auth/auth.server";
import { db } from "../db.server";
import { redirect } from 'remix'


export async function findOrCreateUser(email: string): Promise<(User & {
  Budget: Budget | null;
}) | null> {
  const user = await db.user.upsert({ where: { email }, create: { email, Budget: { create: { total: 0, toBeBudgeted: 0} } }, update: { email }, include: { Budget: true } })
  return user;
}

export async function getAuthenticatedUser(request: Request) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) throw redirect('/login') 
  return user;
}

export async function createStack(user: User & { Budget: Budget | null; }, stack: {label: string}) {
  const { label } = stack
  return await db.stack.create({ data: { label, category: { connectOrCreate: { where: { label_budgetId: { label: "Miscellaneous", budgetId: user.Budget.id } }, create: { label: "Miscellaneous", budgetId: user.Budget.id } } }, budget: { connect: {id: user.Budget.id} } } })
}

export async function createTransaction(data: Transaction) {
  return await db.transaction.createMany({ data })
}