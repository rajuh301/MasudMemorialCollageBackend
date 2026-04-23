/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `student_admissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateOfBirth` to the `officeStaff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notices" ALTER COLUMN "isAcademicNotic" SET DEFAULT false,
ALTER COLUMN "isOfficialNotic" SET DEFAULT false;

-- AlterTable
ALTER TABLE "officeStaff" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isPasswordChange" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "student_admissions" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "isPasswordChange" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "isPasswordChange" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "student_admissions_userId_key" ON "student_admissions"("userId");

-- AddForeignKey
ALTER TABLE "student_admissions" ADD CONSTRAINT "student_admissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
