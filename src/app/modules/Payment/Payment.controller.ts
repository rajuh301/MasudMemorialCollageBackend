import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./Payment.service";

// ─── Initiate Payment ─────────────────────────────────────────────────────────
const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await PaymentService.initiatePaymentIntoDB(user, req.body);

  // result.redirectUrl is the SPG page URL — frontend should redirect student there
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiated. Redirect the student to the payment URL.",
    data: result,
  });
});

// ─── Payment Success Callback (from SPG redirect) ────────────────────────────
const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.handlePaymentSuccess(req.query);

  // Redirect student to frontend success page
  res.redirect(
    `${process.env.FRONTEND_URL}/payment/success?tranId=${result.merchantTranId}`
  );
});

// ─── Payment Fail Callback (from SPG redirect) ───────────────────────────────
const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.handlePaymentFail(req.query);

  // Redirect student to frontend fail page
  res.redirect(
    `${process.env.FRONTEND_URL}/payment/fail?tranId=${result.merchantTranId}`
  );
});

// ─── IPN (Server-to-Server Notification from SPG) ────────────────────────────
const paymentIPN = catchAsync(async (req: Request, res: Response) => {
  await PaymentService.handleIPN(req.body);

  // SPG expects a 200 OK acknowledgement
  res.status(httpStatus.OK).json({ message: "IPN received" });
});

// ─── Get All Payments (Admin) ─────────────────────────────────────────────────
const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllPaymentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments fetched successfully",
    data: result,
  });
});

// ─── Get My Payments (Student) ───────────────────────────────────────────────
const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await PaymentService.getMyPaymentsFromDB(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your payment history fetched successfully",
    data: result,
  });
});

// ─── Get Single Payment ───────────────────────────────────────────────────────
const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentService.getSinglePaymentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment fetched successfully",
    data: result,
  });
});

export const PaymentController = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentIPN,
  getAllPayments,
  getMyPayments,
  getSinglePayment,
};