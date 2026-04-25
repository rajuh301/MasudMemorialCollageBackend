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
exports.PaymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const Payment_service_1 = require("./Payment.service");
// ─── Initiate Payment ─────────────────────────────────────────────────────────
const initiatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield Payment_service_1.PaymentService.initiatePaymentIntoDB(user, req.body);
    // result.redirectUrl is the SPG page URL — frontend should redirect student there
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment initiated. Redirect the student to the payment URL.",
        data: result,
    });
}));
// ─── Payment Success Callback (from SPG redirect) ────────────────────────────
const paymentSuccess = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Payment_service_1.PaymentService.handlePaymentSuccess(req.query);
    // Redirect student to frontend success page
    res.redirect(`${process.env.FRONTEND_URL}/payment/success?tranId=${result.merchantTranId}`);
}));
// ─── Payment Fail Callback (from SPG redirect) ───────────────────────────────
const paymentFail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Payment_service_1.PaymentService.handlePaymentFail(req.query);
    // Redirect student to frontend fail page
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail?tranId=${result.merchantTranId}`);
}));
// ─── IPN (Server-to-Server Notification from SPG) ────────────────────────────
const paymentIPN = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Payment_service_1.PaymentService.handleIPN(req.body);
    // SPG expects a 200 OK acknowledgement
    res.status(http_status_1.default.OK).json({ message: "IPN received" });
}));
// ─── Get All Payments (Admin) ─────────────────────────────────────────────────
const getAllPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Payment_service_1.PaymentService.getAllPaymentsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payments fetched successfully",
        data: result,
    });
}));
// ─── Get My Payments (Student) ───────────────────────────────────────────────
const getMyPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield Payment_service_1.PaymentService.getMyPaymentsFromDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Your payment history fetched successfully",
        data: result,
    });
}));
// ─── Get Single Payment ───────────────────────────────────────────────────────
const getSinglePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield Payment_service_1.PaymentService.getSinglePaymentFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment fetched successfully",
        data: result,
    });
}));
exports.PaymentController = {
    initiatePayment,
    paymentSuccess,
    paymentFail,
    paymentIPN,
    getAllPayments,
    getMyPayments,
    getSinglePayment,
};
