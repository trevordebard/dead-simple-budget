/*
  Warnings:

  - You are about to drop the `budget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "budget" DROP CONSTRAINT "budget_userId_fkey";

-- DropForeignKey
ALTER TABLE "stacks" DROP CONSTRAINT "stacks_budgetId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_userId_fkey";

-- CreateTable
CREATE TABLE "Budget" (
"id" SERIAL,
    "total" DECIMAL(65,2) DEFAULT 0,
    "toBeBudgeted" DECIMAL(65,2),
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stack" (
"id" SERIAL,
    "budgetId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "amount" DECIMAL(65,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
"id" SERIAL,
    "description" TEXT NOT NULL,
    "stack" TEXT NOT NULL,
    "amount" DECIMAL(65,2) NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- DropTable
DROP TABLE "budget";

-- DropTable
DROP TABLE "stacks";

-- DropTable
DROP TABLE "transactions";

-- CreateIndex
CREATE UNIQUE INDEX "Budget_userId_unique" ON "Budget"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "budgetId_label_idx" ON "Stack"("budgetId", "label");

-- AddForeignKey
ALTER TABLE "Budget" ADD FOREIGN KEY("userId")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stack" ADD FOREIGN KEY("budgetId")REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD FOREIGN KEY("userId")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
