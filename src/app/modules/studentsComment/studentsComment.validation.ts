import { z } from "zod";




const createStudentsCommentValidation = z.object({
  name: z.string({ required_error: "Name is required" }),
  description: z.string({ required_error: "Description is required" }),
  batch: z.string({ required_error: "Batch is required" }),
  image: z.string().optional()
});




const updateStudentsCommentValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    batch: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const StudentsCommentValidation = {
  createStudentsCommentValidation,
  updateStudentsCommentValidation,
};