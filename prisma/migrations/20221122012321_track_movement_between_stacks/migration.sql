/*
  Warnings:

  - You are about to drop the column `toBeBudgeted` on the `Budget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "toBeBudgeted";

-- CreateTable
CREATE TABLE "StackActivityLog" (
    "id" TEXT NOT NULL,
    "fromStackId" TEXT NOT NULL,
    "toStackId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stackId" TEXT,

    CONSTRAINT "StackActivityLog_pkey" PRIMARY KEY ("id")
);
