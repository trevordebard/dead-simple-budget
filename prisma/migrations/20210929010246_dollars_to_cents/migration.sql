/*
  Warnings:

  - You are about to drop the column `budgetId` on the `Stack` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Stack` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[label,userId]` on the table `Stack` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Stack` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "budgetId_label_idx";

-- AlterTable
ALTER TABLE "Stack" DROP COLUMN "budgetId",
ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "toBeBudgeted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Stack.label_userId_unique" ON "Stack"("label", "userId");
