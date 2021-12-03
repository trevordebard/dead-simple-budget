import { Transaction } from ".prisma/client";
import { db } from "../db.server";

export async function createTransaction(data: Transaction) {
  return await db.transaction.createMany({data})
}