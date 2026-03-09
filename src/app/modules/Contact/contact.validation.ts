import { z } from "zod";

const createContactValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),

    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),

    phone: z.string({
      required_error: "Phone number is required",
    }),

    comment: z.string({
      required_error: "Comment is required",
    }),
  }),
});

export const ContactValidation = {
  createContactValidation,
};