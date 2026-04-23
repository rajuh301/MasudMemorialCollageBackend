import express, { Request, Response, NextFunction } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { PaymentController } from "./Payment.controller";
import { PaymentValidation } from "./Payment.validation";

const router = express.Router();

// ─── Student: Initiate Payment ────────────────────────────────────────────────
// Student hits this → we create a pending payment record → redirect to SPG page
router.post(
  "/initiate",
  auth(UserRole.STUDENT, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(PaymentValidation.initiatePaymentValidation),
  PaymentController.initiatePayment
);

// ─── SPG Callback (Success) ───────────────────────────────────────────────────
// SPG redirects here after successful payment (GET with query params)
router.get("/success", PaymentController.paymentSuccess);

// ─── SPG Callback (Failure) ───────────────────────────────────────────────────
// SPG redirects here after failed/cancelled payment
router.get("/fail", PaymentController.paymentFail);

// ─── SPG IPN (Instant Payment Notification) ──────────────────────────────────
// SPG hits this backend URL directly to confirm payment (server-to-server)
router.post("/ipn", PaymentController.paymentIPN);

// ─── Get All Payments (Admin) ─────────────────────────────────────────────────
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PaymentController.getAllPayments
);

// ─── Get My Payments (Student) ────────────────────────────────────────────────
router.get(
  "/my-payments",
  auth(UserRole.STUDENT),
  PaymentController.getMyPayments
);

// ─── Get Single Payment ───────────────────────────────────────────────────────
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT),
  PaymentController.getSinglePayment
);

export const PaymentRoutes = router;