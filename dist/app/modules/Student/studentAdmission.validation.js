"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentAdmissionValidation = void 0;
const zod_1 = require("zod");
exports.createStudentAdmissionValidation = zod_1.z.object({
    firstName: zod_1.z.string({ required_error: "First name is required" }),
    lastName: zod_1.z.string({ required_error: "Last name is required" }),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string({ required_error: "Phone number is required" }),
    dateOfBirth: zod_1.z.string({ required_error: "Date of birth is required" }),
    gender: zod_1.z.enum(["MALE", "FEMALE"]),
    bloodGroup: zod_1.z.enum([
        "A_POSITIVE", "B_POSITIVE", "O_POSITIVE", "AB_POSITIVE",
        "A_NEGATIVE", "B_NEGATIVE", "O_NEGATIVE", "AB_NEGATIVE"
    ]),
    maritalStatus: zod_1.z.enum(["MARRIED", "UNMARRIED"]),
    presentAddress: zod_1.z.string({ required_error: "Present address is required" }),
    permanentAddress: zod_1.z.string({ required_error: "Permanent address is required" }),
    guardianName: zod_1.z.string({ required_error: "Guardian name is required" }),
    guardianPhone: zod_1.z.string({ required_error: "Guardian phone is required" }),
    guardianRelation: zod_1.z.string({ required_error: "Guardian relation is required" }),
    previousSchool: zod_1.z.string().optional(),
    previousGPA: zod_1.z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    passingYear: zod_1.z.string().optional().transform(val => val ? parseInt(val) : undefined),
    departmentId: zod_1.z.string({ required_error: "Department ID is required" }),
    subjects: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).transform(val => typeof val === 'string' ? JSON.parse(val) : val),
    admissionFee: zod_1.z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    paymentStatus: zod_1.z.enum(["PAID", "UNPAID"]).optional(),
    image: zod_1.z.string().optional()
});
