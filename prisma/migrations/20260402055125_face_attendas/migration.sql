/*
  Warnings:

  - You are about to drop the column `studentName` on the `results` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentRoll,subject,examType]` on the table `results` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ourTeachers" ADD COLUMN     "faceDescriptor" JSONB;

-- AlterTable
ALTER TABLE "results" DROP COLUMN "studentName";

-- CreateIndex
CREATE UNIQUE INDEX "results_studentRoll_subject_examType_key" ON "results"("studentRoll", "subject", "examType");
