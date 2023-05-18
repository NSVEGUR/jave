/*
  Warnings:

  - You are about to drop the column `thumbnailId` on the `characters` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `characters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageId` to the `characters` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `timestamps` on the `characters` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "characters" DROP CONSTRAINT "characters_thumbnailId_fkey";

-- DropIndex
DROP INDEX "characters_thumbnailId_key";

-- AlterTable
ALTER TABLE "characters" DROP COLUMN "thumbnailId",
ADD COLUMN     "imageId" TEXT NOT NULL,
DROP COLUMN "timestamps",
ADD COLUMN     "timestamps" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "characters_imageId_key" ON "characters"("imageId");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
