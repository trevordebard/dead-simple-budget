/*
  Warnings:

  - You are about to drop the column `category` on the `Stack` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stack" DROP COLUMN "category",
ADD COLUMN     "stack_category_id" INTEGER;

-- CreateTable
CREATE TABLE "StackCategory" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "stackOrder" INTEGER[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StackCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StackCategory" ADD CONSTRAINT "StackCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stack" ADD CONSTRAINT "Stack_stack_category_id_fkey" FOREIGN KEY ("stack_category_id") REFERENCES "StackCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
