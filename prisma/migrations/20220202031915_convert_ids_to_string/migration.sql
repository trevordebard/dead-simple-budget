/*
  Warnings:

  - The primary key for the `BankAccout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Stack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StackCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Stack" DROP CONSTRAINT "Stack_stack_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_stackId_fkey";

-- AlterTable
ALTER TABLE "BankAccout" DROP CONSTRAINT "BankAccout_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BankAccout_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BankAccout_id_seq";

-- AlterTable
ALTER TABLE "Stack" DROP CONSTRAINT "Stack_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "stack_category_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Stack_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Stack_id_seq";

-- AlterTable
ALTER TABLE "StackCategory" DROP CONSTRAINT "StackCategory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "StackCategory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StackCategory_id_seq";

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "stackId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Transaction_id_seq";

-- AddForeignKey
ALTER TABLE "Stack" ADD CONSTRAINT "Stack_stack_category_id_fkey" FOREIGN KEY ("stack_category_id") REFERENCES "StackCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
