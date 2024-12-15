import { Router } from "express";
import CustomerController from "../Controllers/CustomerController";

export function CustomerRoutes(controller: CustomerController): Router { 
    const router = Router();

    router.post("/customer", controller.createCustomer);
    router.post("/customer/verify", controller.verifyOtp);
    router.get("/customer", controller.getCustomer);
    router.get("/customer/all", controller.getAllCustomer);
    router.put("/customer", controller.updateCustomer);
    router.delete("/customer", controller.deleteCustomer);

    return router;
}