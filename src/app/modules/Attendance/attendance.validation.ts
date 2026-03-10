import { z } from "zod";

const createAttendanceValidation = z.object({
  body: z.object({
    teacherId: z.string({ required_error: "Teacher ID is required" }),
  }),
});

export const AttendanceValidation = {
  createAttendanceValidation,
};