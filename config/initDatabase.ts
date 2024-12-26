import { Client } from "pg";
import { config } from "./secrets";

export const initDatabase = async () => {
    const client = new Client({
        host: config.db.host,
        port: config.db.port,
        database: config.db.database,
        user: config.db.user, 
        password: config.db.password,
    });

    try {
        await client.connect();
        const result = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = '${config.db.database}'`
        );

        if (result.rowCount === 0) {
            console.log(`Creating database ${config.db.database}`);
            await client.query(`CREATE DATABASE ${config.db.database}`);
        } else {
            console.log(`Database ${config.db.database} already exists`);
        }
    } catch (err) {
        throw new Error(`Error initializing database: ${err}`);
    } finally {
        await client.end();
    }
};

initDatabase();