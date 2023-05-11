-- CreateEnum
CREATE TYPE "ParticipantSource" AS ENUM ('PROLIFIC', 'LOCAL_TESTING');

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "source" "ParticipantSource" NOT NULL,
    "profileId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_profileId_key" ON "Participant"("profileId");
