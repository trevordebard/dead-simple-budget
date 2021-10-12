/*
  Warnings:

  - You are about to drop the `Budget` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_userId_fkey";

-- DropForeignKey
ALTER TABLE "Stack" DROP CONSTRAINT "Stack_budgetId_fkey";

-- AlterTable
ALTER TABLE "Stack" ALTER COLUMN "category" SET DEFAULT E'Not Categorized';

-- DropTable
DROP TABLE "Budget";
