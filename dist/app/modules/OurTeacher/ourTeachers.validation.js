"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OurTeachersValidation = void 0;
const zod_1 = require("zod");
const createOurTeacherValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    position: zod_1.z.string({ required_error: "Position is required" }),
    subject: zod_1.z.string({ required_error: "Subject is required" }),
    description: zod_1.z.string({ required_error: "Description is required" }),
    rating: zod_1.z.string({ required_error: "Rating is required" }),
    image: zod_1.z.string().optional()
});
const updateOurTeacherValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        position: zod_1.z.string().optional(),
        subject: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        rating: zod_1.z.string().optional(),
        image: zod_1.z.string().optional()
    }),
});
exports.OurTeachersValidation = {
    createOurTeacherValidation,
    updateOurTeacherValidation,
};
