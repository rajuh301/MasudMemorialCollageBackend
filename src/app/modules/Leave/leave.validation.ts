import { z } from "zod";
import { LeaveStatus } from "@prisma/client";

const createLeaveValidation = z.object({
  body: z.object({
    startDate: z.string({ required_error: "Start date is required" }),
    endDate: z.string({ required_error: "End date is required" }),
    reason: z.string({ required_error: "Reason is required" }),
  }),
});

const updateLeaveStatusValidation = z.object({
  body: z.object({
    status: z.enum([LeaveStatus.APPROVED, LeaveStatus.DECLINED], {
      required_error: "Status is required",
    }),
    adminNote: z.string().optional(),
  }),
});

export const LeaveValidation = {
  createLeaveValidation,
  updateLeaveStatusValidation,
};