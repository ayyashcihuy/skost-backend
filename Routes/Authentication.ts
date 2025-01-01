import { Router } from "express";
import AuthenticationController from "../Controllers/AuthenticationController";

export function AuthenticationRoutes(authController: AuthenticationController) {
    const router = Router();

    // login
    router.post("/login", (req, res, next) => authController.Login(req, res, next));
    router.post("/refresh", (req, res, next) => authController.Refresh(req, res, next));

    return router;
}