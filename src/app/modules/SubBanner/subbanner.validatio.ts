import { z } from "zod";





const createSubBannerValidation = z.object({
  title: z.string({ required_error: "Title is required" }),
  subTitle: z.string({ required_error: "Sub-title is required" }),
  description: z.string({ required_error: "Description is required" }),
  image: z.string().optional()
});



const updateSubBannerValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    subTitle: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const SubBannerValidation = {
  createSubBannerValidation,
  updateSubBannerValidation,
};