/*
  Warnings:

  - You are about to drop the column `blurData` on the `CoverImage` table. All the data in the column will be lost.
  - Added the required column `blurDataURL` to the `CoverImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoverImage" DROP COLUMN "blurData",
ADD COLUMN     "blurDataURL" TEXT NOT NULL;
