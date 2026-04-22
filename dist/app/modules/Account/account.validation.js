"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountValidation = void 0;
const zod_1 = require("zod");
const createTransaction = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number({ required_error: "Amount is required" }).positive(),
        type: zod_1.z.enum(["CASH_IN", "CASH_OUT"]),
        purpose: zod_1.z.string({ required_error: "Purpose is required" }),
        category: zod_1.z.string({ required_error: "Category is required" }),
        reference: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        date: zod_1.z.string().optional(), // Can be sent as ISO string
    }),
});
exports.AccountValidation = {
    createTransaction,
};
