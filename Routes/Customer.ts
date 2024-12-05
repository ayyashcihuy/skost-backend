import { Router } from "express";

export function CustomerRoutes(controller: Router): Router { 
    const router = Router();

    router.post("/customer", controller.createCustomer);

    return router;
}