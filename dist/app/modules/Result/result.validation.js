"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultValidation = void 0;
const zod_1 = require("zod");
const createResultValidation = zod_1.z.object({
    body: zod_1.z.object({
        studentRoll: zod_1.z.string().min(1, "Student Roll is required"),
        departmentId: zod_1.z.string().min(1, "Department is required"),
        examType: zod_1.z.string().min(1, "Exam Type is required"),
        subjects: zod_1.z
            .array(zod_1.z.object({
            subject: zod_1.z.string().min(1, "Subject is required"),
            marks: zod_1.z.number(),
            grade: zod_1.z.string().min(1, "Grade is required"),
        }))
            .min(1, "At least one subject is required"),
    }),
});
const getStudentResultValidation = zod_1.z.object({
    query: zod_1.z.object({
        roll: zod_1.z.string().min(1, "Student Roll is required"),
        departmentId: zod_1.z.string().min(1, "Department is required"),
    }),
});
exports.ResultValidation = {
    createResultValidation,
    getStudentResultValidation,
};
