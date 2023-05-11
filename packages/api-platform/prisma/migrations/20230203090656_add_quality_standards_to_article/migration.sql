-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "biasPercentage" DOUBLE PRECISION,
ADD COLUMN     "credibleSource" BOOLEAN,
ADD COLUMN     "omitsOpinion" BOOLEAN;
