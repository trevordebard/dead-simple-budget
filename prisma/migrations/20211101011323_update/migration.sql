-- DropForeignKey
ALTER TABLE "BankAccout" DROP CONSTRAINT "BankAccout_userId_fkey";

-- DropForeignKey
ALTER TABLE "Stack" DROP CONSTRAINT "Stack_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AddForeignKey
ALTER TABLE "Stack" ADD CONSTRAINT "Stack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccout" ADD CONSTRAINT "BankAccout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "BankAccout.plaidItemId_unique" RENAME TO "BankAccout_plaidItemId_key";

-- RenameIndex
ALTER INDEX "Stack.label_userId_unique" RENAME TO "Stack_label_userId_key";

-- RenameIndex
ALTER INDEX "accounts.compound_id_unique" RENAME TO "accounts_compound_id_key";

-- RenameIndex
ALTER INDEX "sessions.access_token_unique" RENAME TO "sessions_access_token_key";

-- RenameIndex
ALTER INDEX "sessions.session_token_unique" RENAME TO "sessions_session_token_key";

-- RenameIndex
ALTER INDEX "users.email_unique" RENAME TO "users_email_key";

-- RenameIndex
ALTER INDEX "verification_requests.token_unique" RENAME TO "verification_requests_token_key";
