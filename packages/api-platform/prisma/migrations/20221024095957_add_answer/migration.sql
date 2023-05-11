-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "gender" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "educationLevel" INTEGER NOT NULL,
    "englishLevel" INTEGER NOT NULL,
    "politicalSpectrum" INTEGER NOT NULL,
    "newsConsumption" INTEGER NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
