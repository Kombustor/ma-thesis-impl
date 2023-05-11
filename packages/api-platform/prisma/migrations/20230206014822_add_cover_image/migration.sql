-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "coverImageId" TEXT;

-- CreateTable
CREATE TABLE "CoverImage" (
    "id" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "blurData" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "CoverImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "CoverImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
