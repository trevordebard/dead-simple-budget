/*
  Warnings:

  - Added the required column `category` to the `Stack` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Budget_userId_unique";

-- AlterTable
ALTER TABLE "Stack" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Stack" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
