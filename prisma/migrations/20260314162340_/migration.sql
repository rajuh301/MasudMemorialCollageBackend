/*
  Warnings:

  - You are about to drop the column `studentRole` on the `student_admissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentRoll]` on the table `student_admissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentRoll` to the `student_admissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student_admissions" DROP COLUMN "studentRole",
ADD COLUMN     "studentRoll" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "student_admissions_studentRoll_key" ON "student_admissions"("studentRoll");
