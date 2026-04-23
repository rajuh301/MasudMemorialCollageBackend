import { PaymentStatus, PaymentType, UserRole } from "@prisma/client";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

// ─── SPG Config ───────────────────────────────────────────────────────────────
// Store these in your .env file
const SPG_BASE_URL =
  process.env.SPG_BASE_URL || "https://spgapi.sblesheba.com:6314";
const SPG_MERCHANT_ID = process.env.SPG_MERCHANT_ID || "YOUR_MERCHANT_ID";
const SPG_MERCHANT_PASSWORD =
  process.env.SPG_MERCHANT_PASSWORD || "YOUR_MERCHANT_PASSWORD";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const SERVICE_CHARGE_RATE = 0.015; // 1.5% as shown on SPG website

// ─── Initiate Payment ─────────────────────────────────────────────────────────
const initiatePaymentIntoDB = async (authUser: any, payload: any) => {
  const {
    studentRoll,
    studentName,
    studentEmail,
    studentPhone,
    amount,
    paymentType,
    description,
  } = payload;

  // Calculate service charge (SPG charges 1.5% for most methods)
  const serviceCharge = parseFloat((amount * SERVICE_CHARGE_RATE).toFixed(2));
  const totalAmount = parseFloat((amount + serviceCharge).toFixed(2));

  // Generate a unique merchant transaction ID
  const merchantTranId = `MMC-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

  // Save pending payment record in DB
  const payment = await prisma.payment.create({
    data: {
      studentRoll,
      studentName,
      studentEmail,
      studentPhone,
      amount,
      serviceCharge,
      totalAmount,
      paymentType: paymentType as PaymentType,
      description,
      merchantTranId,
      status: PaymentStatus.UNPAID,
    },
  });

  // ── Call SPG to initiate payment session ──────────────────────────────────
  // SPG standard payload (adjust field names when you receive official docs)
  const spgPayload = {
    merchantId: SPG_MERCHANT_ID,
    merchantPassword: SPG_MERCHANT_PASSWORD,
    merchantTranId: payment.merchantTranId,
    amount: totalAmount,
    currency: "BDT",
    custName: studentName,
    custEmail: studentEmail || "",
    custPhone: studentPhone,
    productDesc: description || paymentType,
    successUrl: `${BACKEND_URL}/api/v1/payments/success`,
    failUrl: `${BACKEND_URL}/api/v1/payments/fail`,
    cancelUrl: `${BACKEND_URL}/api/v1/payments/fail`,
    ipnUrl: `${BACKEND_URL}/api/v1/payments/ipn`,
  };

  try {
    const spgResponse = await axios.post(
      `${SPG_BASE_URL}/api/initiate`,
      spgPayload,
      {
        headers: { "Content-Type": "application/json" },
        // SPG uses self-signed cert in sandbox — disable SSL check only in dev
        httpsAgent:
          process.env.NODE_ENV === "production"
            ? undefined
            : new (require("https").Agent)({ rejectUnauthorized: false }),
      }
    );

    const redirectUrl = spgResponse.data?.redirectUrl || spgResponse.data?.url;

    if (!redirectUrl) {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        "SPG did not return a redirect URL"
      );
    }

    return {
      paymentId: payment.id,
      merchantTranId: payment.merchantTranId,
      amount,
      serviceCharge,
      totalAmount,
      redirectUrl, // Frontend uses this to redirect student to SPG payment page
    };
  } catch (error: any) {
    // Mark payment as FAILED if SPG call fails
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.UNPAID },
    });

    if (error instanceof ApiError) throw error;
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `SPG connection failed: ${error.message}`
    );
  }
};

// ─── Handle Success Callback ──────────────────────────────────────────────────
// SPG redirects the student's browser here after payment
const handlePaymentSuccess = async (query: any) => {
  const { merchantTranId, spgTranId, status } = query;

  if (!merchantTranId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing transaction ID");
  }

  const payment = await prisma.payment.findUnique({
    where: { merchantTranId },
  });

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment record not found");
  }

  // Update payment to PAID + save SPG transaction ID
  const updated = await prisma.payment.update({
    where: { merchantTranId },
    data: {
      status: PaymentStatus.PAID,
      spgTranId: spgTranId || null,
      spgResponse: query as any,
    },
  });

  // Save to Transaction ledger
  await prisma.transaction.create({
    data: {
      amount: payment.amount,
      type: "CASH_IN",
      purpose: `${payment.paymentType.replace(/_/g, " ")} - ${payment.studentRoll}`,
      category: "Academic",
      reference: spgTranId || merchantTranId,
      description: payment.description || payment.paymentType,
    },
  });

  return updated;
};

// ─── Handle Fail Callback ─────────────────────────────────────────────────────
const handlePaymentFail = async (query: any) => {
  const { merchantTranId } = query;

  if (!merchantTranId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing transaction ID");
  }

  const payment = await prisma.payment.findUnique({
    where: { merchantTranId },
  });

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment record not found");
  }

  // Keep as UNPAID but save SPG response for debugging
  const updated = await prisma.payment.update({
    where: { merchantTranId },
    data: { spgResponse: query as any },
  });

  return updated;
};

// ─── Handle IPN (Server-to-Server) ───────────────────────────────────────────
// SPG posts directly to this endpoint to confirm payment status
const handleIPN = async (body: any) => {
  const { merchantTranId, spgTranId, status, amount } = body;

  if (!merchantTranId) return;

  const payment = await prisma.payment.findUnique({
    where: { merchantTranId },
  });

  if (!payment) return;

  // Only update if SPG confirms SUCCESS and payment not already marked PAID
  if (
    status === "SUCCESS" &&
    payment.status !== PaymentStatus.PAID
  ) {
    await prisma.payment.update({
      where: { merchantTranId },
      data: {
        status: PaymentStatus.PAID,
        spgTranId: spgTranId || null,
        spgResponse: body,
      },
    });

    // Create transaction record if not already created via success callback
    const existing = await prisma.transaction.findFirst({
      where: { reference: spgTranId || merchantTranId },
    });

    if (!existing) {
      await prisma.transaction.create({
        data: {
          amount: payment.amount,
          type: "CASH_IN",
          purpose: `${payment.paymentType.replace(/_/g, " ")} - ${payment.studentRoll}`,
          category: "Academic",
          reference: spgTranId || merchantTranId,
          description: payment.description || payment.paymentType,
        },
      });
    }
  }
};

// ─── Get All Payments (Admin) ─────────────────────────────────────────────────
const getAllPaymentsFromDB = async (query: any) => {
  const { status, paymentType, page = 1, limit = 10, studentRoll } = query;

  const where: any = {};
  if (status) where.status = status as PaymentStatus;
  if (paymentType) where.paymentType = paymentType as PaymentType;
  if (studentRoll) where.studentRoll = { contains: studentRoll, mode: "insensitive" };

  const skip = (Number(page) - 1) * Number(limit);

  const [data, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    meta: { page: Number(page), limit: Number(limit), total },
    data,
  };
};

// ─── Get My Payments (Student) ───────────────────────────────────────────────
const getMyPaymentsFromDB = async (authUser: any) => {
  const student = await prisma.student.findFirst({
    where: { userId: authUser.id, isDeleted: false },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found");
  }

  // Match by email since Payment doesn't have a direct studentId FK
  const result = await prisma.payment.findMany({
    where: { studentEmail: student.email },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// ─── Get Single Payment ───────────────────────────────────────────────────────
const getSinglePaymentFromDB = async (id: string) => {
  const result = await prisma.payment.findUnique({ where: { id } });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  return result;
};

export const PaymentService = {
  initiatePaymentIntoDB,
  handlePaymentSuccess,
  handlePaymentFail,
  handleIPN,
  getAllPaymentsFromDB,
  getMyPaymentsFromDB,
  getSinglePaymentFromDB,
};