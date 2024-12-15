import { Pool } from "pg";

export const up = async (pool: Pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS product_logs (
            id SERIAL PRIMARY KEY,
            room_id INTEGER NOT NULL,
            admin_id INTEGER NOT NULL,
            changes VARCHAR(255) NOT NULL,
            changes_description VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
            CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES room (id) ON DELETE CASCADE,
            CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
        );
    `);
};

export const down = async (pool: Pool) => {
    await pool.query(`DROP TABLE product_logs;`);
};