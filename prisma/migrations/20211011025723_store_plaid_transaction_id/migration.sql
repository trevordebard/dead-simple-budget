/*
  Warnings:

  - A unique constraint covering the columns `[plaidTransactionId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "plaidTransactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction.plaidTransactionId_unique" ON "Transaction"("plaidTransactionId");
