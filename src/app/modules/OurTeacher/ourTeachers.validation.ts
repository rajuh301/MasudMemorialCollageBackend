import { z } from "zod";

const createOurTeacherValidation = z.object({
  name: z.string({ required_error: "Name is required" }),
  position: z.string({ required_error: "Position is required" }),
  subject: z.string({ required_error: "Subject is required" }),
  description: z.string({ required_error: "Description is required" }),
  rating: z.string({ required_error: "Rating is required" }),
  image: z.string().optional()
});

const updateOurTeacherValidation = z.object({
    body: z.object({
        name: z.string().optional(),
        position: z.string().optional(),
        subject: z.string().optional(),
        description: z.string().optional(),
        rating: z.string().optional(),
        image: z.string().optional()
    }),
});

export const OurTeachersValidation = {
    createOurTeacherValidation,
    updateOurTeacherValidation,
};