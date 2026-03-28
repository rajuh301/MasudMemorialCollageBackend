/*
  Warnings:

  - You are about to drop the column `studentId` on the `Result` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_studentId_fkey";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "studentId";
