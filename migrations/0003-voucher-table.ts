import { Pool } from "pg";

export const up = async (pool: Pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vouchers (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            type VARCHAR(10) NOT NULL,
            status VARCHAR(10) NOT NULL,
            reedemed_at TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            CONSTRAINT fk_customers FOREIGN KEY (user_id) REFERENCES customers (id) ON DELETE CASCADE
        );
    `);
};

export const down = async (pool: Pool) => {
    await pool.query(`DROP TABLE vouchers;`);
};