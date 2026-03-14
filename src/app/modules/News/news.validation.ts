import { z } from "zod";

export const createNewsValidation = z.object({
  body: z.object({
    lable: z.string({
      required_error: "Label is required",
    }),
    value: z.string().optional(),
  }),
});

export const updateNewsValidation = z.object({
  body: z.object({
    lable: z.string().optional(),
    value: z.string().optional(),
  }),
});