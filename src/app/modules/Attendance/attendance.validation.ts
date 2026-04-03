import { z } from "zod";

const registerFaceValidation = z.object({
  body: z.object({
    descriptor: z
      .array(z.number())
      .min(128, "Descriptor must have 128 values")
      .max(128, "Descriptor must have 128 values"),
  }),
});

const createAttendanceValidation = z.object({
  body: z.object({
    teacherId: z.string({ required_error: "Teacher ID is required" }),
  }),
});

export const AttendanceValidation = {
  createAttendanceValidation,
  registerFaceValidation,
};