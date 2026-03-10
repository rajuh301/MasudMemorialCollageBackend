"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubBannerValidation = void 0;
const zod_1 = require("zod");
const createSubBannerValidation = zod_1.z.object({
    title: zod_1.z.string({ required_error: "Title is required" }),
    subTitle: zod_1.z.string({ required_error: "Sub-title is required" }),
    description: zod_1.z.string({ required_error: "Description is required" }),
    image: zod_1.z.string().optional()
});
const updateSubBannerValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        subTitle: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
    }),
});
exports.SubBannerValidation = {
    createSubBannerValidation,
    updateSubBannerValidation,
};
