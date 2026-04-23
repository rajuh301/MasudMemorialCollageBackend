-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ADMISSION_FEE', 'SEMESTER_FEE', 'EXAM_FEE', 'OTHER');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "studentRoll" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentEmail" TEXT,
    "studentPhone" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "serviceCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "description" TEXT,
    "spgTranId" TEXT,
    "merchantTranId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "spgResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_spgTranId_key" ON "payments"("spgTranId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_merchantTranId_key" ON "payments"("merchantTranId");
