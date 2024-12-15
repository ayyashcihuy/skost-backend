import { CustomerRequest, CustomerResponse } from "../Models/CustomerModel";

export interface ICustomer {
    getCustomer(id: number): Promise<CustomerResponse>;
    getAllCustomer(): Promise<CustomerResponse[]>;
    createCustomer(customer: CustomerRequest, is_verified: boolean, password?: string): Promise<void>;
    updateCustomer(customer: Partial<CustomerRequest>, id: number): Promise<CustomerResponse>;
    updateVerifiedCustomer(data: { email: string, password: string}): Promise<void>;
    deleteCustomer(id: number): Promise<void>;
}