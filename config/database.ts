import { Pool } from "pg";
import { config } from "./secrets";

export const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user, 
    password: config.db.password,
    max: 10,
    idleTimeoutMillis: 30000,
});