import dotenv from "dotenv";

dotenv.config();

interface Config {
    port: number;
    db: {
        host: string;
        port: number;
        database: string;
        user: string;
        password: string;
    };
    email: {
        service: string;
        host: string;
        port: number;
        user: string;
        password: string;
        secure: boolean;
    },
    secret: string;
}

export const config: Config = {
    port: parseInt(process.env.PORT || "3000"),
    db: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "postgres",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
    },
    email: {
        service: process.env.EMAIL_SERVICE || "gmail",
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT || "465"),
        user: process.env.EMAIL_USERNAME || "",
        password: process.env.EMAIL_PASSWORD || "",
        secure: process.env.ENV === "production", 
    },
    secret: process.env.SECRET || "secret",
}