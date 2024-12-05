import nodemailer from "nodemailer";
import { config } from "./secrets";

export const createTransporter = () => {
    return nodemailer.createTransport({
        service: config.email.service,
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
            user: config.email.user,
            pass: config.email.password,
        },
    })
}