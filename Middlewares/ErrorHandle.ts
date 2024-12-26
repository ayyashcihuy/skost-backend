import { NextFunction, Response, Request } from "express";
import { DatabaseError } from "../Errors/DatabaseError";
import { EmptyArgumentError } from "../Errors/EmptyArgumentError";
import { ValidationError } from "../Errors/ValidationError";
import { NotFoundApi } from "../Errors/UnhandledResponse";
import { AuthenticationError } from "../Errors/AuthenticationError";

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    // Database Error
    if (err instanceof DatabaseError) {
        statusCode = 500;
        message = err.message;
    }

    // Empty Argument Error
    if (err instanceof EmptyArgumentError) {
        statusCode = 400;
        message = err.message;
    }

    // Validation Error
    if (err instanceof ValidationError) {
        statusCode = 400;
        message = err.issues.map((i) => `${i.field}: ${i.reason}`).join(", ");
    }

    // Unhandled Response
    if (err instanceof NotFoundApi) {
        statusCode = 404;
        message = err.message;
    }

    // Authentication Error
    if (err instanceof AuthenticationError) {
        statusCode = err.code;
        message = err.message;
    }

    res.status(statusCode).json({
        status: statusCode,
        message: err.message,
    });
}