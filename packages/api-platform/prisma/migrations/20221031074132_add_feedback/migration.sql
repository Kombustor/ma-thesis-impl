-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "biased" BOOLEAN NOT NULL,
    "basedOnClassifier" BOOLEAN NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_participantId_contentId_key" ON "Feedback"("participantId", "contentId");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
