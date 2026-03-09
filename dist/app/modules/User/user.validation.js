"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createAdmin = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required"
    }),
    admin: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required!"
        }),
        email: zod_1.z.string({
            required_error: "Email is required!"
        }),
        contactNumber: zod_1.z.string({
            required_error: "Contact Number is required!"
        })
    })
});
const createTeacher = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required",
    }),
    teacher: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required!",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required!",
        })
            .email(),
        contactNumber: zod_1.z.string({
            required_error: "Contact Number is required!",
        }),
        joiningDate: zod_1.z.string({
            required_error: "Joining Date is required!",
        }),
        address: zod_1.z.string({
            required_error: "Address is required!",
        }),
    }),
});
const updateStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([client_1.UserStatus.ACTIVE, client_1.UserStatus.BLOCKED, client_1.UserStatus.DELETED])
    })
});
exports.userValidation = {
    createAdmin,
    updateStatus,
    createTeacher
};
