/*
  Warnings:

  - You are about to drop the column `biasRatio` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "biasRatio";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "biased" DROP NOT NULL,
ALTER COLUMN "biased" DROP DEFAULT;
