-- CreateEnum
CREATE TYPE "ProlificCompletionCodeEvent" AS ENUM ('ATTENTION_CHECK_FAILED');

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "attentionCheckFailures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "attentionCheckPassed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ProlificCompletionCode" (
    "id" TEXT NOT NULL,
    "event" "ProlificCompletionCodeEvent" NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "ProlificCompletionCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProlificCompletionCode_event_key" ON "ProlificCompletionCode"("event");
