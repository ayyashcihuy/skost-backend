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

export const CustomerResponseSchema = z.object({
    id: z.number(),
    full_name: z.string(),
    gender: z.string(),
    email: z.string().email(),
    phone: z.string(),
    occupation: z.string(),
});

export type CustomerRequest = z.infer<typeof CustomerRequestSchema>;
export type CustomerResponse = z.infer<typeof CustomerResponseSchema>;