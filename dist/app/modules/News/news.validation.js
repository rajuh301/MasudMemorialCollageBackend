"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNewsValidation = exports.createNewsValidation = void 0;
const zod_1 = require("zod");
exports.createNewsValidation = zod_1.z.object({
    body: zod_1.z.object({
        lable: zod_1.z.string({
            required_error: "Label is required",
        }),
        value: zod_1.z.string().optional(),
    }),
});
exports.updateNewsValidation = zod_1.z.object({
    body: zod_1.z.object({
        lable: zod_1.z.string().optional(),
        value: zod_1.z.string().optional(),
    }),
});
