/*
  Warnings:

  - A unique constraint covering the columns `[indexInStudy]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Article_indexInStudy_key" ON "Article"("indexInStudy");
