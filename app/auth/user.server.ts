import { Budget, User } from ".prisma/client";
import { db } from "~/utils/db.server";


export async function findOrCreateUser(email: string): Promise<(User & {
  Budget: Budget | null;
}) | null> {
  const user = await db.user.upsert({ where: { email }, create: { email, Budget: { create: { total: 0, toBeBudgeted: 0} } }, update: { email }, include: { Budget: true } })
  return user;
}