"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
// ─── SPG Config ───────────────────────────────────────────────────────────────
// Store these in your .env file
const SPG_BASE_URL = process.env.SPG_BASE_URL || "https://spgapi.sblesheba.com:6314";
const SPG_MERCHANT_ID = process.env.SPG_MERCHANT_ID || "YOUR_MERCHANT_ID";
const SPG_MERCHANT_PASSWORD = process.env.SPG_MERCHANT_PASSWORD || "YOUR_MERCHANT_PASSWORD";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const SERVICE_CHARGE_RATE = 0.015; // 1.5% as shown on SPG website
// ─── Initiate Payment ─────────────────────────────────────────────────────────
const initiatePaymentIntoDB = (authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { studentRoll, studentName, studentEmail, studentPhone, amount, paymentType, description, } = payload;
    // Calculate service charge (SPG charges 1.5% for most methods)
    const serviceCharge = parseFloat((amount * SERVICE_CHARGE_RATE).toFixed(2));
    const totalAmount = parseFloat((amount + serviceCharge).toFixed(2));
    // Generate a unique merchant transaction ID
    const merchantTranId = `MMC-${Date.now()}-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
    // Save pending payment record in DB
    const payment = yield prisma_1.default.payment.create({
        data: {
            studentRoll,
            studentName,
            studentEmail,
            studentPhone,
            amount,
            serviceCharge,
            totalAmount,
            paymentType: paymentType,
            description,
            merchantTranId,
            status: client_1.PaymentStatus.UNPAID,
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
        const spgResponse = yield axios_1.default.post(`${SPG_BASE_URL}/api/initiate`, spgPayload, {
            headers: { "Content-Type": "application/json" },
            // SPG uses self-signed cert in sandbox — disable SSL check only in dev
            httpsAgent: process.env.NODE_ENV === "production"
                ? undefined
                : new (require("https").Agent)({ rejectUnauthorized: false }),
        });
        const redirectUrl = ((_a = spgResponse.data) === null || _a === void 0 ? void 0 : _a.redirectUrl) || ((_b = spgResponse.data) === null || _b === void 0 ? void 0 : _b.url);
        if (!redirectUrl) {
            throw new ApiError_1.default(http_status_1.default.BAD_GATEWAY, "SPG did not return a redirect URL");
        }
        return {
            paymentId: payment.id,
            merchantTranId: payment.merchantTranId,
            amount,
            serviceCharge,
            totalAmount,
            redirectUrl, // Frontend uses this to redirect student to SPG payment page
        };
    }
    catch (error) {
        // Mark payment as FAILED if SPG call fails
        yield prisma_1.default.payment.update({
            where: { id: payment.id },
            data: { status: client_1.PaymentStatus.UNPAID },
        });
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_1.default.BAD_GATEWAY, `SPG connection failed: ${error.message}`);
    }
});
// ─── Handle Success Callback ──────────────────────────────────────────────────
// SPG redirects the student's browser here after payment
const handlePaymentSuccess = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { merchantTranId, spgTranId, status } = query;
    if (!merchantTranId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Missing transaction ID");
    }
    const payment = yield prisma_1.default.payment.findUnique({
        where: { merchantTranId },
    });
    if (!payment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Payment record not found");
    }
    // Update payment to PAID + save SPG transaction ID
    const updated = yield prisma_1.default.payment.update({
        where: { merchantTranId },
        data: {
            status: client_1.PaymentStatus.PAID,
            spgTranId: spgTranId || null,
            spgResponse: query,
        },
    });
    // Save to Transaction ledger
    yield prisma_1.default.transaction.create({
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
});
// ─── Handle Fail Callback ─────────────────────────────────────────────────────
const handlePaymentFail = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { merchantTranId } = query;
    if (!merchantTranId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Missing transaction ID");
    }
    const payment = yield prisma_1.default.payment.findUnique({
        where: { merchantTranId },
    });
    if (!payment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Payment record not found");
    }
    // Keep as UNPAID but save SPG response for debugging
    const updated = yield prisma_1.default.payment.update({
        where: { merchantTranId },
        data: { spgResponse: query },
    });
    return updated;
});
// ─── Handle IPN (Server-to-Server) ───────────────────────────────────────────
// SPG posts directly to this endpoint to confirm payment status
const handleIPN = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { merchantTranId, spgTranId, status, amount } = body;
    if (!merchantTranId)
        return;
    const payment = yield prisma_1.default.payment.findUnique({
        where: { merchantTranId },
    });
    if (!payment)
        return;
    // Only update if SPG confirms SUCCESS and payment not already marked PAID
    if (status === "SUCCESS" &&
        payment.status !== client_1.PaymentStatus.PAID) {
        yield prisma_1.default.payment.update({
            where: { merchantTranId },
            data: {
                status: client_1.PaymentStatus.PAID,
                spgTranId: spgTranId || null,
                spgResponse: body,
            },
        });
        // Create transaction record if not already created via success callback
        const existing = yield prisma_1.default.transaction.findFirst({
            where: { reference: spgTranId || merchantTranId },
        });
        if (!existing) {
            yield prisma_1.default.transaction.create({
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
});
// ─── Get All Payments (Admin) ─────────────────────────────────────────────────
const getAllPaymentsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, paymentType, page = 1, limit = 10, studentRoll } = query;
    const where = {};
    if (status)
        where.status = status;
    if (paymentType)
        where.paymentType = paymentType;
    if (studentRoll)
        where.studentRoll = { contains: studentRoll, mode: "insensitive" };
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = yield Promise.all([
        prisma_1.default.payment.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.default.payment.count({ where }),
    ]);
    return {
        meta: { page: Number(page), limit: Number(limit), total },
        data,
    };
});
// ─── Get My Payments (Student) ───────────────────────────────────────────────
const getMyPaymentsFromDB = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield prisma_1.default.student.findFirst({
        where: { userId: authUser.id, isDeleted: false },
    });
    if (!student) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Student not found");
    }
    // Match by email since Payment doesn't have a direct studentId FK
    const result = yield prisma_1.default.payment.findMany({
        where: { studentEmail: student.email },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
// ─── Get Single Payment ───────────────────────────────────────────────────────
const getSinglePaymentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findUnique({ where: { id } });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Payment not found");
    }
    return result;
});
exports.PaymentService = {
    initiatePaymentIntoDB,
    handlePaymentSuccess,
    handlePaymentFail,
    handleIPN,
    getAllPaymentsFromDB,
    getMyPaymentsFromDB,
    getSinglePaymentFromDB,
};
