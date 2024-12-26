import { Pool } from "pg";
import * as fs from "fs";
import { config } from "./secrets";
import * as path from "path";
import { DatabaseError } from "../Errors/DatabaseError";

const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user, 
    password: config.db.password,
    max: 10,
    idleTimeoutMillis: 30000,
});

const migrationsPath = path.join(__dirname, "../migrations");

export const runMigration = async () => {
    const files = fs.readdirSync(migrationsPath);

    try {
        for (const file of files) {
            const migration = await import(path.join(migrationsPath, file));
            console.log(`Running migration ${file}`);
            await migration.up(pool);
        }
    console.log("Migration completed successfully");
    } catch (err) {
        throw new DatabaseError(`Error running migration: ${err}`);
    }
}

export const revertMigration = async () => {
    const files = fs.readdirSync(migrationsPath);

    try {
        for (const file of files.reverse()) {
            const migration = await import(path.join(migrationsPath, file));
            console.log(`Reverting migration ${file}`);
            await migration.down(pool);
        }
    console.log("Migration reverted successfully");
    } catch (err) {
        throw new DatabaseError(`Error reverting migration: ${err}`);
    }
}

// Uncomment the following line to revert the migration
// revertMigration();
// runMigration();