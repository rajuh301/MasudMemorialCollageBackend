/*
  Warnings:

  - You are about to drop the column `faceDescriptor` on the `ourTeachers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ourTeachers" DROP COLUMN "faceDescriptor";

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "faceDescriptor" DOUBLE PRECISION[];
