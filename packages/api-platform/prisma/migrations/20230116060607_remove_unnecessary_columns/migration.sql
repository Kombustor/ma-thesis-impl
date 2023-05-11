/*
  Warnings:

  - You are about to drop the column `indexInStudy` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `groundTruthBiased` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `basedOnClassifier` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `articleProgress` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `attentionCheckFailures` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `dataUsableForResearch` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `feedbackMechanism` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParticipantProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProlificCompletionCode` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[browserSignature]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `browserSignature` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_participantId_fkey";

-- DropForeignKey
ALTER TABLE "ParticipantProgress" DROP CONSTRAINT "ParticipantProgress_participantId_fkey";

-- DropIndex
DROP INDEX "Article_indexInStudy_key";

-- DropIndex
DROP INDEX "Participant_profileId_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "indexInStudy";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "groundTruthBiased";

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "basedOnClassifier";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "articleProgress",
DROP COLUMN "attentionCheckFailures",
DROP COLUMN "dataUsableForResearch",
DROP COLUMN "feedbackMechanism",
DROP COLUMN "profileId",
DROP COLUMN "sessionId",
DROP COLUMN "source",
ADD COLUMN     "browserSignature" TEXT NOT NULL;

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "ParticipantProgress";

-- DropTable
DROP TABLE "ProlificCompletionCode";

-- DropEnum
DROP TYPE "FeedbackMechanism";

-- DropEnum
DROP TYPE "ParticipantSource";

-- DropEnum
DROP TYPE "ProlificCompletionCodeEvent";

-- DropEnum
DROP TYPE "StudyProgress";

-- CreateIndex
CREATE UNIQUE INDEX "Participant_browserSignature_key" ON "Participant"("browserSignature");
