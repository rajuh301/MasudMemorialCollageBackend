import { z } from "zod";

const registerFaceValidation = z.object({
  body: z.object({
    descriptor: z
      .array(z.number({ invalid_type_error: "Descriptor values must be numbers" }))
      .length(128, "Descriptor must be exactly 128 values"), 
  }),
});

const createAttendanceValidation = z.object({
  body: z.object({
    // teacherId অবশ্যই একটি ভ্যালিড UUID হতে হবে (যেহেতু আপনি Prisma-তে UUID ব্যবহার করছেন)
    teacherId: z.string({ 
        required_error: "Teacher ID is required" 
    }).uuid("Invalid Teacher ID format"), 
  }),
});

export const AttendanceValidation = {
  createAttendanceValidation,
  registerFaceValidation,
};