import "dotenv/config";
import express from "express";
import { NotFoundApi } from "./Errors/UnhandledResponse";
import { errorHandler } from "./Middlewares/ErrorHandle";
import { initDatabase } from "./config/initDatabase";
import { runMigration } from "./config/migrate";

const app = express();
const port = process.env.PORT || 3000;

(async () => {
    // init database and tables if not exist
    await initDatabase();
    await runMigration();
    
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE"
        );
        res.setHeader("Access-Control-Allow-Headers", "content-type,accept,set-cookie");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        if (req.method.toUpperCase() === "OPTIONS") {
            res.statusCode = 204;
            res.setHeader("Content-Length", 0);
            res.end();
            return;
        }

        next();
    });

    app.use(express.json());

    app.all("*", (req, res, next) => {
        next(new NotFoundApi(`Cannot find ${req.originalUrl} on this server`));
    });

    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server is running on localhost:${port}`);
    });
})();
