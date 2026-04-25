"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const initiatePaymentValidation = zod_1.z.object({
    body: zod_1.z.object({
        studentRoll: zod_1.z.string({ required_error: "Student roll is required" }),
        studentName: zod_1.z.string({ required_error: "Student name is required" }),
        studentEmail: zod_1.z.string().email().optional(),
        studentPhone: zod_1.z.string({ required_error: "Student phone is required" }),
        amount: zod_1.z
            .number({ required_error: "Amount is required" })
            .positive("Amount must be greater than 0"),
        paymentType: zod_1.z.enum([
            client_1.PaymentType.ADMISSION_FEE,
            client_1.PaymentType.SEMESTER_FEE,
            client_1.PaymentType.EXAM_FEE,
            client_1.PaymentType.OTHER,
        ], { required_error: "Payment type is required" }),
        description: zod_1.z.string().optional(),
    }),
});
exports.PaymentValidation = {
    initiatePaymentValidation,
};
