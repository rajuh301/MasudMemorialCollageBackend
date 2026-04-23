import { z } from "zod";
import { PaymentType } from "@prisma/client";

const initiatePaymentValidation = z.object({
    body: z.object({
        studentRoll: z.string({ required_error: "Student roll is required" }),
        studentName: z.string({ required_error: "Student name is required" }),
        studentEmail: z.string().email().optional(),
        studentPhone: z.string({ required_error: "Student phone is required" }),
        amount: z
            .number({ required_error: "Amount is required" })
            .positive("Amount must be greater than 0"),
        paymentType: z.enum(
            [
                PaymentType.ADMISSION_FEE,
                PaymentType.SEMESTER_FEE,
                PaymentType.EXAM_FEE,
                PaymentType.OTHER,
            ],
            { required_error: "Payment type is required" }
        ),
        description: z.string().optional(),
    }),
});

export const PaymentValidation = {
    initiatePaymentValidation,
};