import { Pool } from "pg";
import { ICustomer } from "../Interfaces/ICustomer";
import { CustomerResponse, CustomerRequest } from "../Models/CustomerModel";

export class CustomerRepository implements ICustomer {
    private readonly pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }
    
    public async getCustomer(id: number): Promise<CustomerResponse> {
        throw new Error("Method not implemented.");
    }
    
    public async getAllCustomer(): Promise<CustomerResponse[]> {
        throw new Error("Method not implemented.");
    }

    public async createCustomer(customer: CustomerRequest): Promise<CustomerResponse> {
        throw new Error("Method not implemented.");
    }

    public async updateCustomer(customer: Partial<CustomerRequest>, id: number): Promise<CustomerResponse> {
        throw new Error("Method not implemented.");
    }

    public async deleteCustomer(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
}