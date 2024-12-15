import { Pool } from "pg";

export const up = async (pool: Pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS room (
            id SERIAL PRIMARY KEY,
            property_id INTEGER NOT NULL,
            name VARCHAR(100) NOT NULL,
            description VARCHAR(255) NOT NULL,
            price INTEGER NOT NULL,
            category VARCHAR(10) NOT NULL,
            total_availability INTEGER NOT NULL,
            current_availability INTEGER NOT NULL,
            specifications VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
            CONSTRAINT fk_properties FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
        );
    `);
};

export const down = async (pool: Pool) => {
    await pool.query(`DROP TABLE room;`);
};