-- AddForeignKey
ALTER TABLE "StackActivityLog" ADD CONSTRAINT "StackActivityLog_fromStackId_fkey" FOREIGN KEY ("fromStackId") REFERENCES "Stack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StackActivityLog" ADD CONSTRAINT "StackActivityLog_toStackId_fkey" FOREIGN KEY ("toStackId") REFERENCES "Stack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
