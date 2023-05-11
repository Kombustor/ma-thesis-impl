/*
  Warnings:

  - You are about to drop the column `studyProgress` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "studyProgress";

-- CreateTable
CREATE TABLE "ParticipantProgress" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "progress" "StudyProgress" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipantProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParticipantProgress" ADD CONSTRAINT "ParticipantProgress_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
