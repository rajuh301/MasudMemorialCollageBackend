import { Gender, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    admin: z.object({
        name: z.string({
            required_error: "Name is required!"
        }),
        email: z.string({
            required_error: "Email is required!"
        }),
        contactNumber: z.string({
            required_error: "Contact Number is required!"
        })
    })
});


const createTeacher = z.object({
    password: z.string({
        required_error: "Password is required",
    }),

    teacher: z.object({
        name: z.string({
            required_error: "Name is required!",
        }),

        email: z
            .string({
                required_error: "Email is required!",
            })
            .email(),

        contactNumber: z.string({
            required_error: "Contact Number is required!",
        }),

        joiningDate: z.string({
            required_error: "Joining Date is required!",
        }),

        address: z.string({
            required_error: "Address is required!",
        }),
    }),
});


const updateStatus = z.object({
    body: z.object({
        status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED])
    })
})

export const userValidation = {
    createAdmin,
    updateStatus,
    createTeacher
}