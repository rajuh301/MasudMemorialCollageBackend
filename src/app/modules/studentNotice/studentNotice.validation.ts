import { z } from "zod";

const createStudentNoticeValidation = z.object({
    body: z.object({
        departmentId: z.string({
            required_error: "Department ID is required",
        }),
        studentRoll: z.string({
            required_error: "Student roll is required",
        }),
       
        description: z.string({
            required_error: "Description is required",
        }),
    }),
});

const updateStudentNoticeValidation = z.object({
    body: z.object({
        departmentId: z.string().optional(),
        studentRoll: z.string().optional(),
        studentId: z.string().optional(),
        description: z.string().optional(),
    }),
});

export const StudentNoticeValidation = {
    createStudentNoticeValidation,
    updateStudentNoticeValidation,
};