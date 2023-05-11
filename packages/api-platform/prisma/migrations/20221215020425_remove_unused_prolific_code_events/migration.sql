/*
  Warnings:

  - The values [DID_NOT_GIVE_CONSENT,DATA_NOT_USABLE_FOR_RESEARCH] on the enum `ProlificCompletionCodeEvent` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProlificCompletionCodeEvent_new" AS ENUM ('SUCCESS', 'ATTENTION_CHECK_FAILED');
ALTER TABLE "ProlificCompletionCode" ALTER COLUMN "event" TYPE "ProlificCompletionCodeEvent_new" USING ("event"::text::"ProlificCompletionCodeEvent_new");
ALTER TYPE "ProlificCompletionCodeEvent" RENAME TO "ProlificCompletionCodeEvent_old";
ALTER TYPE "ProlificCompletionCodeEvent_new" RENAME TO "ProlificCompletionCodeEvent";
DROP TYPE "ProlificCompletionCodeEvent_old";
COMMIT;
