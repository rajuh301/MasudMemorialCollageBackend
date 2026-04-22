/*
  Warnings:

  - A unique constraint covering the columns `[studentRoll,subject,examType,academicYear]` on the table `results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isAcademicNotic` to the `notices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isOfficialNotic` to the `notices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicYear` to the `results` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'OFFICESTAFF';

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_teacherId_fkey";

-- DropIndex
DROP INDEX "results_studentRoll_subject_examType_key";

-- AlterTable
ALTER TABLE "attendances" ADD COLUMN     "officeStaffId" TEXT,
ALTER COLUMN "teacherId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notices" ADD COLUMN     "isAcademicNotic" BOOLEAN NOT NULL,
ADD COLUMN     "isOfficialNotic" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "results" ADD COLUMN     "academicYear" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "officeStaff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "contactNumber" TEXT NOT NULL,
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "faceDescriptor" DOUBLE PRECISION[],
    "createdById" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "officeStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "govermentBody" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "govermentBody_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_summaries" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "goldenPlus" INTEGER NOT NULL DEFAULT 0,
    "aPlus" INTEGER NOT NULL DEFAULT 0,
    "aGrade" INTEGER NOT NULL DEFAULT 0,
    "aMinus" INTEGER NOT NULL DEFAULT 0,
    "passRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "result_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaves" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "studentId" TEXT,
    "teacherId" TEXT,
    "officeStaffId" TEXT,
    "approvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "officeStaff_email_key" ON "officeStaff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "officeStaff_userId_key" ON "officeStaff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "result_summaries_year_key" ON "result_summaries"("year");

-- CreateIndex
CREATE UNIQUE INDEX "results_studentRoll_subject_examType_academicYear_key" ON "results"("studentRoll", "subject", "examType", "academicYear");

-- AddForeignKey
ALTER TABLE "officeStaff" ADD CONSTRAINT "officeStaff_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "officeStaff" ADD CONSTRAINT "officeStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_officeStaffId_fkey" FOREIGN KEY ("officeStaffId") REFERENCES "officeStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_officeStaffId_fkey" FOREIGN KEY ("officeStaffId") REFERENCES "officeStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
