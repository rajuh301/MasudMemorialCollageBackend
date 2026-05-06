/*
  Warnings:

  - Added the required column `designation` to the `officeStaff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "officeStaff" ADD COLUMN     "designation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "designation" TEXT NOT NULL;
