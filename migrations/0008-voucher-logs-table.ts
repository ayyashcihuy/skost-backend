import { Pool } from "pg";

export const up = async (pool: Pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS voucher_logs (
            id SERIAL PRIMARY KEY,
            voucher_id INTEGER NOT NULL,
            admin_id INTEGER NOT NULL,
            changes VARCHAR(255) NOT NULL,
            changes_description VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
            CONSTRAINT fk_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers (id) ON DELETE CASCADE,
            CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
        );
    `);
};

export const down = async (pool: Pool) => {
    await pool.query(`DROP TABLE voucher_logs;`);
};