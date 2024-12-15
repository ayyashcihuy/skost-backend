import { Pool } from "pg";
import { ICustomer } from "../Interfaces/ICustomer";
import { CustomerResponse, CustomerRequest } from "../Models/CustomerModel";
import { DatabaseError } from "../Errors/DatabaseError";
import { ClientError } from "../Errors/ClientError";
import * as argon2 from "argon2";

export class CustomerRepository implements ICustomer {
    private readonly pool: Pool;
    private readonly secret: string;    

    constructor(pool: Pool, secret: string) {
        this.pool = pool;
        this.secret = secret
    }
    
    public async getCustomer(id: number): Promise<CustomerResponse> {
        try {
            const customer = await this.pool.query(`
                SELECT * FROM customers WHERE id = ${id}
            `);
    
            if (customer.rowCount === 0) {
                throw new ClientError(`Customer with id ${id} not found`);
            }

            return {
                id: customer.rows[0].id,
                full_name: customer.rows[0].full_name,
                gender: customer.rows[0].gender,
                email: customer.rows[0].email,
                phone: customer.rows[0].phone,
                occupation: customer.rows[0].occupation,
            }
        } catch (err) {
            throw new DatabaseError(`Failed to get customer: ${err}`);
        }
    }
    
    public async getAllCustomer(): Promise<CustomerResponse[]> {
        try {
            const customers = await this.pool.query(`
                SELECT * FROM customers
            `);

            return customers.rows.map((customer) => ({
                id: customer.id,
                full_name: customer.full_name,
                gender: customer.gender,
                email: customer.email,
                phone: customer.phone,
                occupation: customer.occupation,
            }));
        } catch (err) {
            throw new DatabaseError(`Failed to get all customers: ${err}`);
        }
    }

    public async createCustomer(customer: CustomerRequest, is_verified: boolean): Promise<void> {
        try {
            // for default password
            const hashedPassword = await argon2.hash(this.secret);
            await this.pool.query(`
                INSERT INTO customers (full_name, gender, email, phone, occupation, is_verified, password)
                VALUES (${customer.full_name}, ${customer.gender}, ${customer.email}, ${customer.phone}, ${customer.occupation}, ${is_verified}, ${hashedPassword})
            `);
            return;
        } catch (err) {
            throw new DatabaseError(`Failed to create customer: ${err}`);
        }
    }

    public async updateCustomer(customer: Partial<CustomerRequest>, id: number): Promise<CustomerResponse> {
        try {
            const updatedData = await this.pool.query(`
                UPDATE customers
                SET full_name = ${customer.full_name}, gender = ${customer.gender}, email = ${customer.email}, phone = ${customer.phone}, occupation = ${customer.occupation}
                WHERE id = ${id}
                RETURNING *
            `);
            return {
                id: updatedData.rows[0].id,
                full_name: updatedData.rows[0].full_name,
                gender: updatedData.rows[0].gender,
                email: updatedData.rows[0].email,
                phone: updatedData.rows[0].phone,
                occupation: updatedData.rows[0].occupation,
            }
        } catch (err) {
            throw new DatabaseError(`Failed to update customer: ${err}`);
        }
    }

    public async updateVerifiedCustomer(data: { email: string, password: string}): Promise<void> {
        try {
            const hashedPassord = await argon2.hash(data.password);
            await this.pool.query(`
                UPDATE customers
                SET is_verified = true, password = ${hashedPassord}
                WHERE email = ${data.email}
            `);
            return;
        } catch (err) {
            throw new DatabaseError(`Failed to update customer: ${err}`);
        }
    }

    public async deleteCustomer(id: number): Promise<void> {
        try {
            await this.pool.query(`
                DELETE FROM customers WHERE id = ${id}
            `);
            return;
        } catch (err) {
            throw new DatabaseError(`Failed to delete customer: ${err}`);
        }
    }
}