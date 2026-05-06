-- CreateTable
CREATE TABLE "student_notices" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "studentRoll" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_notices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_notices" ADD CONSTRAINT "student_notices_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_notices" ADD CONSTRAINT "student_notices_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_admissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
