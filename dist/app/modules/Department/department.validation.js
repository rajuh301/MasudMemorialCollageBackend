"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentValidation = void 0;
const zod_1 = require("zod");
const createDepartmentValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Department name is required",
        }),
        description: zod_1.z.string({
            required_error: "description is required",
        }),
        year: zod_1.z.string({
            required_error: "Year is required",
        }),
    }),
});
const updateDepartmentValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        year: zod_1.z.string().optional(),
    }),
});
exports.DepartmentValidation = {
    createDepartmentValidation,
    updateDepartmentValidation,
};
