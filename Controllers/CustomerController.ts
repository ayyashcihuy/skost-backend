import { NextFunction, Request, Response } from "express";
import { CustomerRequestSchema } from "../Models/CustomerModel";
import { Issue, ValidationError } from "../Errors/ValidationError";

class CustomerController {
    public async createCustomer(req: Request, res: Response, next: NextFunction) {
        // validate request body
        const rawRequestBody = req.body;
        const validatedRequestBody = CustomerRequestSchema.safeParse(rawRequestBody);

        if (!validatedRequestBody.success) {
            const issues: Issue[] = [];

            validatedRequestBody.error.issues.forEach((issue) => {
                issues.push({
                    field: issue.code,
                    reason: issue.message
                });
            })

            next(new ValidationError(issues));
        }

        // create customer but with is_verified = false
        // const customer = await this.customerService.createCustomer(validatedRequestBody.data);

        // generate otp and send the otp to the email
        // TODO: CREATE SERVICE FOR EMAIL AND OTP SERVICES
        
        res.status(200).json({
            message: "Customer created successfully"
        });
    }
}

export default CustomerController;