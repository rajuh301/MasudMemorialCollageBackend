-- AlterTable
ALTER TABLE "events" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "notices" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ourTeachers" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
