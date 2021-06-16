/*
  Warnings:

  - A unique constraint covering the columns `[plaidItemId]` on the table `BankAccout` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plaidItemId` to the `BankAccout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankAccout" ADD COLUMN     "plaidItemId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BankAccout.plaidItemId_unique" ON "BankAccout"("plaidItemId");
