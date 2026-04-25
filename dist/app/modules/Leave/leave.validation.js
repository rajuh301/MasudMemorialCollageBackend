"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const createLeaveValidation = zod_1.z.object({
    body: zod_1.z.object({
        startDate: zod_1.z.string({ required_error: "Start date is required" }),
        endDate: zod_1.z.string({ required_error: "End date is required" }),
        reason: zod_1.z.string({ required_error: "Reason is required" }),
    }),
});
const updateLeaveStatusValidation = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([client_1.LeaveStatus.APPROVED, client_1.LeaveStatus.DECLINED], {
            required_error: "Status is required",
        }),
        adminNote: zod_1.z.string().optional(),
    }),
});
exports.LeaveValidation = {
    createLeaveValidation,
    updateLeaveStatusValidation,
};
