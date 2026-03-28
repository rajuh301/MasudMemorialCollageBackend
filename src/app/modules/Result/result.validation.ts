import { z } from "zod";

const createResultValidation = z.object({
  body: z.object({
    studentRoll: z.string().min(1, "Student Roll is required"),
    departmentId: z.string().min(1, "Department is required"),
    examType: z.string().min(1, "Exam Type is required"),
    subjects: z
      .array(
        z.object({
          subject: z.string().min(1, "Subject is required"),
          marks: z.number(),
          grade: z.string().min(1, "Grade is required"),
        })
      )
      .min(1, "At least one subject is required"),
  }),
});

const getStudentResultValidation = z.object({
  query: z.object({
    roll: z.string().min(1, "Student Roll is required"),
    departmentId: z.string().min(1, "Department is required"),
  }),
});

export const ResultValidation = {
  createResultValidation,
  getStudentResultValidation,
};