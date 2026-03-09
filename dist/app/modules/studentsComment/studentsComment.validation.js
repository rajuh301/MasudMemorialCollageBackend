"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsCommentValidation = void 0;
const zod_1 = require("zod");
const createStudentsCommentValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    description: zod_1.z.string({ required_error: "Description is required" }),
    batch: zod_1.z.string({ required_error: "Batch is required" }),
    image: zod_1.z.string().optional()
});
const updateStudentsCommentValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        batch: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
    }),
});
exports.StudentsCommentValidation = {
    createStudentsCommentValidation,
    updateStudentsCommentValidation,
};
