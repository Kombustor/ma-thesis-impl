/*
  Warnings:

  - You are about to drop the column `content` on the `Article` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "HtmlType" AS ENUM ('H1', 'H2', 'H3', 'SPAN');

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "content";

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "indexInArticle" INTEGER NOT NULL,
    "paragraphIndex" INTEGER,
    "htmlType" "HtmlType" NOT NULL,
    "biased" BOOLEAN NOT NULL DEFAULT false,
    "text" TEXT NOT NULL,
    "articleId" TEXT,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
