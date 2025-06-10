/*
  Warnings:

  - A unique constraint covering the columns `[name,folderId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,ownerId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_name_folderId_key" ON "File"("name", "folderId");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_ownerId_key" ON "Folder"("name", "ownerId");
