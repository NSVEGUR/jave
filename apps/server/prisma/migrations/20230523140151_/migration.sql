-- DropForeignKey
ALTER TABLE "characters" DROP CONSTRAINT "characters_fileId_fkey";

-- AlterTable
ALTER TABLE "characters" ALTER COLUMN "fileId" DROP NOT NULL,
ALTER COLUMN "timestamps" DROP NOT NULL;

-- CreateTable
CREATE TABLE "live_channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "live_channels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "live_channels_name_key" ON "live_channels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "live_channels_logoId_key" ON "live_channels"("logoId");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_channels" ADD CONSTRAINT "live_channels_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
