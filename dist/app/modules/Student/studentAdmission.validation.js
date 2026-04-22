"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentAdmissionValidation = void 0;
const zod_1 = require("zod");
exports.createStudentAdmissionValidation = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string(),
    dateOfBirth: zod_1.z.string(),
    gender: zod_1.z.enum(["MALE", "FEMALE"]),
    bloodGroup: zod_1.z.enum([
        "A_POSITIVE",
        "B_POSITIVE",
        "O_POSITIVE",
        "AB_POSITIVE",
        "A_NEGATIVE",
        "B_NEGATIVE",
        "O_NEGATIVE",
        "AB_NEGATIVE"
    ]),
    maritalStatus: zod_1.z.enum(["MARRIED", "UNMARRIED"]),
    presentAddress: zod_1.z.string(),
    permanentAddress: zod_1.z.string(),
    guardianName: zod_1.z.string(),
    guardianPhone: zod_1.z.string(),
    guardianRelation: zod_1.z.string(),
    previousSchool: zod_1.z.string().optional(),
    previousGPA: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseFloat(val) : undefined)),
    passingYear: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : undefined)),
    departmentId: zod_1.z.string(),
    subjects: zod_1.z
        .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
        .transform((val) => typeof val === "string" ? JSON.parse(val) : val),
    admissionFee: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseFloat(val) : undefined)),
    paymentStatus: zod_1.z.enum(["PAID", "UNPAID"]).optional(),
    image: zod_1.z.string().optional(),
});
