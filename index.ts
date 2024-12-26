import "dotenv/config";
import express, { Request, Response} from "express";
import { NotFoundApi } from "./Errors/UnhandledResponse";
import { errorHandler } from "./Middlewares/ErrorHandle";
import { CustomerRoutes } from "./Routes/Customer";
import { pool } from "./config/database";
import { CustomerRepository } from "./Repositories/CustomerRepositories";
import { OneTimePasswordRepository } from "./Repositories/OneTimePasswordRepositories";
import { EmailRepository } from "./Repositories/EmailRepositories";
import { config } from "./config/secrets";
import CustomerController from "./Controllers/CustomerController";
import { createTransporter } from "./config/email";

const app = express();
const port = process.env.PORT || 3000;

function healthCheck(_req: Request, res: Response) {
    pool.query("SELECT 1", [], (err) => {
        if (err) {
            res.status(500).json({
                status: "error",
                message: "Database connection error"
            });
            return;
        }

        res.status(200).json({
            status: "ok"
        });
    });
}

(async () => {    
    // initialize database
    const customerRepository = new CustomerRepository(pool, config.secret);
    const emailRepository = new EmailRepository(config.email.formAddress, createTransporter());
    const otpRepository = new OneTimePasswordRepository(pool);
    const customerController = new CustomerController(customerRepository, otpRepository, emailRepository);

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
    
    // route for health check
    app.get("/", (req, res) => healthCheck(req, res));
    app.use("/api/v1/customer", CustomerRoutes(customerController));
    
    app.all("*", (req, _res, next) => {
        next(new NotFoundApi(`Cannot find ${req.originalUrl} on this server`));
    });
    
    app.use(errorHandler);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
})();
