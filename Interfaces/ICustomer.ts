import { CustomerRequest, CustomerResponse } from "../Models/CustomerModel";

export interface ICustomer {
    getCustomer(id: number): Promise<CustomerResponse>;
    getAllCustomer(): Promise<CustomerResponse[]>;
    createCustomer(customer: CustomerRequest): Promise<CustomerResponse>;
    updateCustomer(customer: Partial<CustomerRequest>, id: number): Promise<CustomerResponse>;
    deleteCustomer(id: number): Promise<void>;
}