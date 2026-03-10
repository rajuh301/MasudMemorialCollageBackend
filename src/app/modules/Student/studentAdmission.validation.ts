import { z } from "zod";

export const createStudentAdmissionValidation = z.object({
  firstName: z.string({ required_error: "First name is required" }),
  lastName: z.string({ required_error: "Last name is required" }),
  email: z.string().email().optional(),
  phone: z.string({ required_error: "Phone number is required" }),
  dateOfBirth: z.string({ required_error: "Date of birth is required" }),
  gender: z.enum(["MALE", "FEMALE"]),
  bloodGroup: z.enum([
    "A_POSITIVE", "B_POSITIVE", "O_POSITIVE", "AB_POSITIVE",
    "A_NEGATIVE", "B_NEGATIVE", "O_NEGATIVE", "AB_NEGATIVE"
  ]),
  maritalStatus: z.enum(["MARRIED", "UNMARRIED"]),
  presentAddress: z.string({ required_error: "Present address is required" }),
  permanentAddress: z.string({ required_error: "Permanent address is required" }),
  guardianName: z.string({ required_error: "Guardian name is required" }),
  guardianPhone: z.string({ required_error: "Guardian phone is required" }),
  guardianRelation: z.string({ required_error: "Guardian relation is required" }),
  previousSchool: z.string().optional(),
  previousGPA: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  passingYear: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  departmentId: z.string({ required_error: "Department ID is required" }),
  subjects: z.union([z.string(), z.array(z.string())]).transform(val => 
    typeof val === 'string' ? JSON.parse(val) : val
  ),
  admissionFee: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  paymentStatus: z.enum(["PAID", "UNPAID"]).optional(),
  image: z.string().optional()
});