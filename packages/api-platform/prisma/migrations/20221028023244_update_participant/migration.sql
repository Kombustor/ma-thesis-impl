-- CreateEnum
CREATE TYPE "FeedbackMechanism" AS ENUM ('HIGHLIGHTS', 'COMPARISON');

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "feedbackMechanism" "FeedbackMechanism";
