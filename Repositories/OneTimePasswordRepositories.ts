import { Pool } from "pg";
import { IOneTimePasswordRepository } from "../Interfaces/IOneTimePassword";
import { InvalidArgumentError } from "../Errors/InvalidArgumentError";
import { randomBytes } from "node:crypto";
import * as argon2 from "argon2";
import { DatabaseError } from "../Errors/DatabaseError";



export class OneTimePasswordRepository implements IOneTimePasswordRepository {
    private readonly pool: Pool;

    constructor(pool: Pool) {
        if (pool == null) {
            throw new InvalidArgumentError("Pool cannot be null");
        }

        this.pool = pool;
    }

    public async validate(email: string, otp: string, _signal?: AbortSignal): Promise<boolean> {
        try {
            const cursor = await this.pool.query(`
                SELECT otp_code, created_at, expires_at FROM otp_session WHERE email = '${email}'
                AND expires_at > '${new Date().toISOString()}'
                ORDER BY created_at DESC NULLS LAST LIMIT 3`);

            let validated: boolean = false;

            for await (const row of cursor.rows) {
                const savedOtp = row.otp_code;
                if (!savedOtp) {
                    continue;
                }

                const databaseValidated = await argon2.verify(savedOtp, otp);
                if (databaseValidated) {
                    validated = true;
                    break;
                }
            }

            return validated;
        } catch (err) {
            throw new DatabaseError(`Failed to validate otp: ${err}`);
        }
    }

    generate(): string {
        return randomBytes(3).toString("hex").toUpperCase().slice(0, 5);
    }

    async save(email: string, otp: string, _signal?: AbortSignal): Promise<void> {
        try {
            const hashedOtp = await argon2.hash(otp);
    
            // set expires_at to 5 mins
            const expires_at = new Date();
            expires_at.setMinutes(expires_at.getMinutes() + 5);
            const query = `
                INSERT INTO otp_session (email, otp_code, expires_at)
                VALUES ($1, $2, $3)
                ON CONFLICT (email) DO UPDATE SET otp_code = $2, expires_at = $3
            `;
    
            await this.pool.query(
                query,
                [email, hashedOtp, expires_at]
            );
            
            return;
        } catch (err) {
            throw new DatabaseError(`Failed to save otp: ${err}`);
        }
    }
}