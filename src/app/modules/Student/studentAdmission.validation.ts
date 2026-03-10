import { z } from "zod";

export const createStudentAdmissionValidation = z.object({

  firstName: z.string(),
  lastName: z.string(),

  email: z.string().email().optional(),

  phone: z.string(),

  dateOfBirth: z.string(),

  gender: z.enum(["MALE", "FEMALE"]),

  bloodGroup: z.enum([
    "A_POSITIVE",
    "B_POSITIVE",
    "O_POSITIVE",
    "AB_POSITIVE",
    "A_NEGATIVE",
    "B_NEGATIVE",
    "O_NEGATIVE",
    "AB_NEGATIVE"
  ]),

  maritalStatus: z.enum(["MARRIED", "UNMARRIED"]),

  presentAddress: z.string(),
  permanentAddress: z.string(),

  guardianName: z.string(),
  guardianPhone: z.string(),
  guardianRelation: z.string(),

  previousSchool: z.string().optional(),

  previousGPA: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),

  passingYear: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),

  departmentId: z.string(),

  subjects: z
    .union([z.string(), z.array(z.string())])
    .transform((val) =>
      typeof val === "string" ? JSON.parse(val) : val
    ),

  admissionFee: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),

  paymentStatus: z.enum(["PAID", "UNPAID"]).optional(),

  image: z.string().optional(),
});