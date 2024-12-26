import { Router } from "express";
import CustomerController from "../Controllers/CustomerController";

export function CustomerRoutes(controller: CustomerController): Router {
    const router = Router();

    router.post("/register", (req, res, next) => controller.createCustomer(req, res, next));
    router.post("/otp/verify", (req, res, next) => controller.verifyOtp(req, res, next));
    router.post("/otp/refresh", (req, res, next) => controller.refreshOtp(req, res, next));
    router.get("/get", (req, res, next) => controller.getCustomer(req, res, next));
    router.get("/get/all", (req, res, next) => controller.getAllCustomer(req, res, next));
    router.put("/update", (req, res, next) => controller.updateCustomer(req, res, next));
    router.delete("/delete", (req, res, next) => controller.deleteCustomer(req, res, next));

    return router;
}