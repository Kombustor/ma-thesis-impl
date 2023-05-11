/*
  Warnings:

  - A unique constraint covering the columns `[source]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Article_source_key" ON "Article"("source");
