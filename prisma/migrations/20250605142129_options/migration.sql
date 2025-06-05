-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_ownerId_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
