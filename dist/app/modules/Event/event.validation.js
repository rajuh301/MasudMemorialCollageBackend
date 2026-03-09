"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventValidation = void 0;
const zod_1 = require("zod");
const createEventValidation = zod_1.z.object({
    title: zod_1.z.string({ required_error: "Title is required" }),
    description: zod_1.z.string({ required_error: "Description is required" }),
    location: zod_1.z.string({ required_error: "Location is required" }),
    date: zod_1.z.string({ required_error: "Date is required" }),
    image: zod_1.z.string().optional(),
});
const updateEventValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        date: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
    }),
});
exports.EventValidation = {
    createEventValidation,
    updateEventValidation,
};
