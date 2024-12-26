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
        formAddress: string;
    },
    secret: string;
    jwt: {
        private_key_path: string;
        public_key_path: string;
        expires_in: string;
        refresh_expires_in: string;
        cookie_secret: string;
    },
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
        formAddress: process.env.EMAIL_FORM_ADDRESS || "support@skost.com",
    },
    secret: process.env.SECRET || "secret",
    jwt: {
        private_key_path: process.env.JWT_PRIVATE_KEY_PATH || "",
        public_key_path: process.env.JWT_PUBLIC_KEY_PATH || "",
        expires_in: process.env.JWT_EXPIRES_IN || "15m",
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        cookie_secret: process.env.JWT_COOKIE_SECRET || "secret",
    }
}