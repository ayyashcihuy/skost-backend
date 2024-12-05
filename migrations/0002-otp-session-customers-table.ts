import { Pool } from "pg";

export const up = async (pool: Pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS otp_session (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            otp_code VARCHAR(6) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        );
    `);
};

export const down = async (pool: Pool) => {
    await pool.query(`DROP TABLE otp_session;`);
};