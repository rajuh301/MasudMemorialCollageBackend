"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceValidation = void 0;
const zod_1 = require("zod");
const registerFaceValidation = zod_1.z.object({
    body: zod_1.z.object({
        descriptor: zod_1.z
            .array(zod_1.z.number({ invalid_type_error: "Descriptor values must be numbers" }))
            .length(128, "Descriptor must be exactly 128 values"),
    }),
});
const createAttendanceValidation = zod_1.z.object({
    body: zod_1.z.object({
        // teacherId অবশ্যই একটি ভ্যালিড UUID হতে হবে (যেহেতু আপনি Prisma-তে UUID ব্যবহার করছেন)
        teacherId: zod_1.z.string({
            required_error: "Teacher ID is required"
        }).uuid("Invalid Teacher ID format"),
    }),
});
exports.AttendanceValidation = {
    createAttendanceValidation,
    registerFaceValidation,
};
