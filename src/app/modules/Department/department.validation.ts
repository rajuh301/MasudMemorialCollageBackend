import { z } from "zod";

const createDepartmentValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: "Department name is required",
    }),
    discription: z.string({
      required_error: "Ddiscription is required",
    }),

    year: z.string({
      required_error: "Year is required",
    }),
  }),
});

const updateDepartmentValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    year: z.string().optional(),
  }),
});

export const DepartmentValidation = {
  createDepartmentValidation,
  updateDepartmentValidation,
};