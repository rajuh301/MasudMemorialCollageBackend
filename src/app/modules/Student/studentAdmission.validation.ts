import { z } from "zod";

export const createStudentAdmissionValidation = z.object({
  firstName: z.string({ required_error: "First name is required" }),
  lastName: z.string({ required_error: "Last name is required" }),
  email: z.string().email().optional(),
  phone: z.string({ required_error: "Phone number is required" }),
  dateOfBirth: z.string({ required_error: "Date of birth is required" }), // manual input
  gender: z.enum(["MALE", "FEMALE"]),
  bloodGroup: z.enum([
    "A_POSITIVE","B_POSITIVE","O_POSITIVE","AB_POSITIVE",
    "A_NEGATIVE","B_NEGATIVE","O_NEGATIVE","AB_NEGATIVE"
  ]),
  maritalStatus: z.enum(["MARRIED","UNMARRIED"]),
  presentAddress: z.string({ required_error: "Present address is required" }),
  permanentAddress: z.string({ required_error: "Permanent address is required" }),
  guardianName: z.string({ required_error: "Guardian name is required" }),
  guardianPhone: z.string({ required_error: "Guardian phone is required" }),
  guardianRelation: z.string({ required_error: "Guardian relation is required" }),
  previousSchool: z.string().optional(),
  previousGPA: z.number().optional(),
  passingYear: z.number().optional(),
  departmentId: z.string({ required_error: "Department ID is required" }),
  subjects: z.array(z.string()),
  admissionFee: z.number().optional(),
  paymentStatus: z.enum(["PAID","UNPAID"]).optional(),
  image: z.string().optional() // like SubBanner
});