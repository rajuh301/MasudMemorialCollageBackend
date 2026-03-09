import { z } from "zod";

const createNoticeValidation = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    isImportant: z.boolean({
      required_error: "isImportant is required",
    }),
    isRecentNotice: z.boolean({
      required_error: "isRecentNotice is required",
    }),
    date: z.string({
      required_error: "Date is required",
    }),
  }),
});

const updateNoticeValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    isImportant: z.boolean().optional(),
    isRecentNotice: z.boolean().optional(),
    date: z.string().optional(),
  }),
});

export const NoticeValidation = {
  createNoticeValidation,
  updateNoticeValidation,
};