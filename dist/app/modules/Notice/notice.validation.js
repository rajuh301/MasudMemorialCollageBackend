"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeValidation = void 0;
const zod_1 = require("zod");
const createNoticeValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        description: zod_1.z.string({
            required_error: "Description is required",
        }),
        isImportant: zod_1.z.boolean({
            required_error: "isImportant is required",
        }),
        isRecentNotice: zod_1.z.boolean({
            required_error: "isRecentNotice is required",
        }),
        date: zod_1.z.string({
            required_error: "Date is required",
        }),
    }),
});
const updateNoticeValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        isImportant: zod_1.z.boolean().optional(),
        isRecentNotice: zod_1.z.boolean().optional(),
        date: zod_1.z.string().optional(),
    }),
});
exports.NoticeValidation = {
    createNoticeValidation,
    updateNoticeValidation,
};
