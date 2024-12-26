import { NextFunction, Request, Response } from "express";
import { CustomerPasswordRequestSchema, CustomerRequestSchema } from "../Models/CustomerModel";
import { ICustomer } from "../Interfaces/ICustomer";
import { Issue, ValidationError } from "../Errors/ValidationError";
import { IOneTimePasswordRepository } from "../Interfaces/IOneTimePassword";
import { ClientError } from "../Errors/ClientError";
import { IEmailRepository } from "../Interfaces/IEmailSender";

class CustomerController {
    private readonly customerRepository: ICustomer;
    private readonly otpRepository: IOneTimePasswordRepository;
    private readonly emailRepository: IEmailRepository;

    constructor(customerRepository: ICustomer, otp: IOneTimePasswordRepository, emailRepository: IEmailRepository) {
        this.customerRepository = customerRepository;
        this.otpRepository = otp;
        this.emailRepository = emailRepository;
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
                // check if customer is already verified
                const isVerified = await this.customerRepository.isVerified(validatedRequestBody.data.email);

                if (isVerified) {
                    next(new ClientError("Customer is already created"));
                    return;
                }

                // create customer but with is_verified = false
                const customer = this.customerRepository.createCustomer(validatedRequestBody.data, false);
    
                // generate otp and send the otp to the email
                const otp = this.otpRepository.generate();

                const sendEmail = this.emailRepository.sendEmail({
                    to: validatedRequestBody.data.email,
                    subject: "Verify your account",
                    body: `Your OTP is ${otp}. Please enter it to verify your account.`
                })
                
                // save initial user and otp in session
                await Promise.all([
                    this.otpRepository.save(validatedRequestBody.data.email, otp),
                    customer, 
                    sendEmail
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

    public async refreshOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.body.email;

            if (email == null) {
                next(new ClientError("Email is required"));
                return;
            }

            // check if customer is already verified
            const isVerified = await this.customerRepository.isVerified(email);

            if (isVerified) {
                next(new ClientError("Customer is verified!"));
                return;
            }

            const otp = this.otpRepository.generate();

            const sendEmail = this.emailRepository.sendEmail({
                to: email,
                subject: "Verify your account",
                body: `Your OTP is ${otp}. Please enter it to verify your account.`
            })
            
            await Promise.all([
                this.otpRepository.save(email, otp),
                sendEmail
            ]);

            res.status(200).json({
                message: "OTP refreshed successfully"
            });
        } catch (err) {
            next(err);
        }
    }
}

export default CustomerController;