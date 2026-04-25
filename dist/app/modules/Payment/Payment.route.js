"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Payment_controller_1 = require("./Payment.controller");
const Payment_validation_1 = require("./Payment.validation");
const router = express_1.default.Router();
// ─── Student: Initiate Payment ────────────────────────────────────────────────
// Student hits this → we create a pending payment record → redirect to SPG page
router.post("/initiate", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(Payment_validation_1.PaymentValidation.initiatePaymentValidation), Payment_controller_1.PaymentController.initiatePayment);
// ─── SPG Callback (Success) ───────────────────────────────────────────────────
// SPG redirects here after successful payment (GET with query params)
router.get("/success", Payment_controller_1.PaymentController.paymentSuccess);
// ─── SPG Callback (Failure) ───────────────────────────────────────────────────
// SPG redirects here after failed/cancelled payment
router.get("/fail", Payment_controller_1.PaymentController.paymentFail);
// ─── SPG IPN (Instant Payment Notification) ──────────────────────────────────
// SPG hits this backend URL directly to confirm payment (server-to-server)
router.post("/ipn", Payment_controller_1.PaymentController.paymentIPN);
// ─── Get All Payments (Admin) ─────────────────────────────────────────────────
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), Payment_controller_1.PaymentController.getAllPayments);
// ─── Get My Payments (Student) ────────────────────────────────────────────────
router.get("/my-payments", (0, auth_1.default)(client_1.UserRole.STUDENT), Payment_controller_1.PaymentController.getMyPayments);
// ─── Get Single Payment ───────────────────────────────────────────────────────
router.get("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.STUDENT), Payment_controller_1.PaymentController.getSinglePayment);
exports.PaymentRoutes = router;
