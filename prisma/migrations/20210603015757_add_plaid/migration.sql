/*
  Warnings:

  - You are about to alter the column `total` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,2)` to `DoublePrecision`.
  - You are about to alter the column `toBeBudgeted` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,2)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `Stack` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,2)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Budget" ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "toBeBudgeted" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Stack" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BankAccout" (
    "id" SERIAL NOT NULL,
    "plaidAccessToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BankAccout" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
