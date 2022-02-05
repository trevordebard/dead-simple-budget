/*
  Warnings:

  - You are about to drop the column `userId` on the `BankAccout` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Stack` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `StackCategory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `StackCategory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `toBeBudgeted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[label,budgetId]` on the table `Stack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label,budgetId]` on the table `StackCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `budgetId` to the `BankAccout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetId` to the `Stack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetId` to the `StackCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `StackCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "BankAccout" DROP CONSTRAINT "BankAccout_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Stack" DROP CONSTRAINT "Stack_userId_fkey";

-- DropForeignKey
ALTER TABLE "StackCategory" DROP CONSTRAINT "StackCategory_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropIndex
DROP INDEX "Stack_label_userId_key";

-- AlterTable
ALTER TABLE "BankAccout" DROP COLUMN "userId",
ADD COLUMN     "budgetId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Stack" DROP COLUMN "userId",
ADD COLUMN     "budgetId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StackCategory" DROP COLUMN "category",
DROP COLUMN "userId",
ADD COLUMN     "budgetId" TEXT NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "userId",
ADD COLUMN     "budgetId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "image",
DROP COLUMN "toBeBudgeted",
DROP COLUMN "total",
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "toBeBudgeted" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Budget_userId_key" ON "Budget"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Stack_label_budgetId_key" ON "Stack"("label", "budgetId");

-- CreateIndex
CREATE UNIQUE INDEX "StackCategory_label_budgetId_key" ON "StackCategory"("label", "budgetId");

-- AddForeignKey
ALTER TABLE "StackCategory" ADD CONSTRAINT "StackCategory_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stack" ADD CONSTRAINT "Stack_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccout" ADD CONSTRAINT "BankAccout_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
