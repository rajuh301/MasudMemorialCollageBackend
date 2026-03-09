"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidation = void 0;
const zod_1 = require("zod");
const createContactValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email(),
        phone: zod_1.z.string({
            required_error: "Phone number is required",
        }),
        comment: zod_1.z.string({
            required_error: "Comment is required",
        }),
    }),
});
exports.ContactValidation = {
    createContactValidation,
};
