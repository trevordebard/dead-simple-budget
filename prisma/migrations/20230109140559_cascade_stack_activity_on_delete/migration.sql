-- DropForeignKey
ALTER TABLE "StackActivityLog" DROP CONSTRAINT "StackActivityLog_fromStackId_fkey";

-- DropForeignKey
ALTER TABLE "StackActivityLog" DROP CONSTRAINT "StackActivityLog_toStackId_fkey";

-- AddForeignKey
ALTER TABLE "StackActivityLog" ADD CONSTRAINT "StackActivityLog_fromStackId_fkey" FOREIGN KEY ("fromStackId") REFERENCES "Stack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StackActivityLog" ADD CONSTRAINT "StackActivityLog_toStackId_fkey" FOREIGN KEY ("toStackId") REFERENCES "Stack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
