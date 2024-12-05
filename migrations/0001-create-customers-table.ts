import { Pool } from "pg";

export const up = async (pool: Pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS otp_session (
            id SERIAL PRIMARY KEY,
            full_name VARCHAR(100) NOT NULL,
            gender VARCHAR(10) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL,
            is_verified BOOLEAN NOT NULL DEFAULT false,
            phone VARCHAR(15) NOT NULL,
            occupation VARCHAR(100) NOT NULL
        );
    `);
};

export const down = async (pool: Pool) => {
    await pool.query(`DROP TABLE customers;`);
};