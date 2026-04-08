import { z } from "zod";

const createTransaction = z.object({
    body: z.object({
        amount: z.number({ required_error: "Amount is required" }).positive(),
        type: z.enum(["CASH_IN", "CASH_OUT"]),
        purpose: z.string({ required_error: "Purpose is required" }),
        category: z.string({ required_error: "Category is required" }),
        reference: z.string().optional(),
        description: z.string().optional(),
        date: z.string().optional(), // Can be sent as ISO string
    }),
});

export const AccountValidation = {
    createTransaction,
};