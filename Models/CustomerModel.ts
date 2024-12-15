import { z } from "zod";

export const CustomerRequestSchema = z.object({
    full_name: z.string().min(3, {
        message: "Full name must be at least 3 characters long"
    }).max(100, {
        message: "Full name must be at most 100 characters long"
    }),
    gender: z.enum(["male", "female"]),
    email: z.string().email(),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 characters long"
    }).max(15, {
        message: "Phone number must be at most 15 characters long"
    }),
    occupation: z.string().min(3, {
        message: "Occupation must be at least 3 characters long"
    }).max(100, {
        message: "Occupation must be at most 100 characters long"
    }),
});

export const CustomerPasswordRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    }).max(16, {
        message: "Password must be at most 100 characters long"
    }),
    otp: z.string().min(6, {
        message: "OTP must be at least 6 characters long"
    })
});

export const CustomerResponseSchema = z.object({
    id: z.number(),
    full_name: z.string(),
    gender: z.string(),
    email: z.string().email(),
    phone: z.string(),
    occupation: z.string(),
});

export type CustomerRequest = z.infer<typeof CustomerRequestSchema>;
export type CustomerPasswordRequest = z.infer<typeof CustomerPasswordRequestSchema>;
export type CustomerResponse = z.infer<typeof CustomerResponseSchema>;