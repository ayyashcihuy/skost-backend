import e, { NextFunction, Request, Response } from "express";
import { CustomerPasswordRequestSchema, CustomerRequestSchema } from "../Models/CustomerModel";
import { ICustomer } from "../Interfaces/ICustomer";
import { Issue, ValidationError } from "../Errors/ValidationError";
import { IOneTimePasswordRepository } from "../Interfaces/IOneTimePassword";
import { ClientError } from "../Errors/ClientError";

class CustomerController {
    private readonly customerRepository: ICustomer;
    private readonly otpRepository: IOneTimePasswordRepository;

    constructor(customerRepository: ICustomer, otp: IOneTimePasswordRepository) {
        this.customerRepository = customerRepository;
        this.otpRepository = otp;
    }

    public async getCustomer(req: Request, res: Response, next: NextFunction) {
        const { id } = req.query;

        if (id == null && id === '') {
            next(new ClientError("Invalid customer id"));
            return;
        }
        
        try {
            const customer = await this.customerRepository.getCustomer(Number(id));

            res.status(200).json(customer);
        } catch (err) {
            next(err);
        }
    }
    public async getAllCustomer(_req: Request, res: Response, next: NextFunction) {
        try {
            const customers = await this.customerRepository.getAllCustomer();

            res.status(200).json(customers);
        } catch (err) {
            next(err);
        }
    }

    public async updateCustomer(req: Request, res: Response, next: NextFunction) {
        const { id } = req.query;

        if (id == null && id === '') {
            next(new ClientError("Invalid customer id"));
            return;
        }

        try {
            const customer = await this.customerRepository.updateCustomer(req.body, Number(id));

            res.status(200).json(customer);
        } catch (err) {
            next(err);
        }
    }

    public async deleteCustomer(req: Request, res: Response, next: NextFunction) {
        const { id } = req.query;

        if (id == null && id === '') {
            next(new ClientError("Invalid customer id"));
            return;
        }

        try {
            await this.customerRepository.deleteCustomer(Number(id));

            res.status(200).json({
                message: "Customer deleted successfully"
            });
        } catch (err) {
            next(err);
        }
    }

    public async createCustomer(req: Request, res: Response, next: NextFunction) {
        try  {
            // validate request body
            const rawRequestBody = req.body;
            const validatedRequestBody = CustomerRequestSchema.safeParse(rawRequestBody);
    
            if (validatedRequestBody.success) {
                // create customer but with is_verified = false
                // TODO: password should always empty since we need to generate password after the user verifies the email using otp
                const customer = this.customerRepository.createCustomer(validatedRequestBody.data, false);
    
                // generate otp and send the otp to the email
                const otp = this.otpRepository.generate();
    
                // TODO: CREATE SERVICE FOR EMAIL AND OTP SERVICES
                // save initial user and otp in session
                await Promise.all([
                    customer, 
                    this.otpRepository.save(validatedRequestBody.data.email, otp)
                ]);
    
                res.status(200).json({
                    message: "Customer created successfully, kindly check email for otp confirmation"
                });
                return;
            } else {
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
            }
        } catch (err) {
            next(err);
        }
    }

    public async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const rawRequestBody = req.body;
            const validatedRequestBody = CustomerPasswordRequestSchema.safeParse(rawRequestBody);

            if (validatedRequestBody.success) {
                // verify otp
                const validated = await this.otpRepository.validate(validatedRequestBody.data.email, validatedRequestBody.data.otp);

                if (validated) {
                    // UPDATE CUSTOMER PASSWORD AND IS_VERIFIED
                    await this.customerRepository.updateVerifiedCustomer({ email: validatedRequestBody.data.email, password: validatedRequestBody.data.password });

                    res.status(200).json({
                        message: "Customer password updated successfully"
                    });
                    return;
                } else {
                    res.status(400).json({
                        message: "Invalid OTP"
                    });
                    return;
                }
            } else {
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
            }
        } catch (err) { 
            next(err); 
        }
    }
}

export default CustomerController;