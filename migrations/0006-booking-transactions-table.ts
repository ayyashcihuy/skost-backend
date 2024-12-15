import { Pool } from "pg";

export const up = async (pool: Pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS booking_transactions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            room_id INTEGER NOT NULL,
            booking_start_date DATE NOT NULL,
            booking_end_date DATE NOT NULL,
            status VARCHAR(10) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
            CONSTRAINT fk_customers FOREIGN KEY (user_id) REFERENCES customers (id) ON DELETE CASCADE,
            CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES room (id) ON DELETE CASCADE
        );
    `);
};

export const down = async (pool: Pool) => {
    await pool.query(`DROP TABLE booking_transactions;`);
};