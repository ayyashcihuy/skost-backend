import { Pool } from "pg";
import { IEmailRepository } from "../Interfaces/IEmailSender";
import { IOneTimePasswordRepository } from "../Interfaces/IOneTimePassword";
import { InvalidArgumentError } from "../Errors/InvalidArgumentError";
import { randomBytes } from "node:crypto";
import * as argon2 from "argon2";
import { DatabaseError } from "../Errors/DatabaseError";



export class OneTimePasswordRepository implements IOneTimePasswordRepository {
    private readonly pool: Pool;
    private readonly mailClient: IEmailRepository;
    private readonly fromAddress: string;

    constructor(pool: Pool, mailClient: IEmailRepository, fromAddress: string) {
        if (pool == null) {
            throw new InvalidArgumentError("Pool cannot be null");
        }

        if (mailClient == null) {
            throw new InvalidArgumentError("Mail client cannot be null");
        }

        if (fromAddress == null) {
            throw new InvalidArgumentError("From address cannot be null");
        }

        this.pool = pool;
        this.mailClient = mailClient;    
        this.fromAddress = fromAddress;
    }

    sendToEmail(email: string, otp: string, signal?: AbortSignal): Promise<void> {
        throw new Error("Method not implemented.");
    }

    sendToEmailWithCustomValues(email: string, otp: string, subject: string, content: string, signal?: AbortSignal): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async validate(email: string, otp: string, _signal?: AbortSignal): Promise<boolean> {
        try {
            const cursor = await this.pool.query(`
                SELECT otp_code, created_at, expires_at FROM otp_session WHERE email = ${email}
                AND expires_at > ${new Date().toISOString()}
                ORDER BY created_at DESC NULLS LAST LIMIT 3`);

            let validated: boolean = false;

            for await (const row of cursor.rows) {
                const hashedOtp = row.otp_code;
                if (!hashedOtp) {
                    continue;
                }

                const databaseValidated = await argon2.verify(otp, hashedOtp);
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
        const hashedOtp = await argon2.hash(otp);

        // set expires_at to 5 mins
        const expires_at = new Date();
        expires_at.setMinutes(expires_at.getMinutes() + 5);

        await this.pool.query(`
            INSERT INTO otp_session (email, otp_code, expires_at)
            VALUES (${email}, ${hashedOtp}, ${expires_at})
            ON CONFLICT (email) DO UPDATE SET otp_code = ${hashedOtp}, expires_at = ${expires_at}
        `);
    }
}