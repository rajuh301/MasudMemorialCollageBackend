import { z } from "zod";

const createGovermentBodyValidation = z.object({
    name: z.string({ required_error: "Name is required" }),
    description: z.string({ required_error: "Description is required" }),
    image: z.string().optional(), // comes from file upload, not body
});

const updateGovermentBodyValidation = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
});

export const GovermentBodyValidation = {
    createGovermentBodyValidation,
    updateGovermentBodyValidation,
};