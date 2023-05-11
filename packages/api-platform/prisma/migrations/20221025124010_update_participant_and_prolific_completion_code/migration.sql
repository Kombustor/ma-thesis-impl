-- AlterEnum
ALTER TYPE "ProlificCompletionCodeEvent" ADD VALUE 'DID_NOT_GIVE_CONSENT';

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "dataProcessingConsent" BOOLEAN NOT NULL DEFAULT false;
