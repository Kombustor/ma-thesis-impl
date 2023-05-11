-- CreateTable
CREATE TABLE "EmailWhitelist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "EmailWhitelist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailWhitelist_email_key" ON "EmailWhitelist"("email");
