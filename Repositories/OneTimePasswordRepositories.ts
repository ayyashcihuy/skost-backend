import { Pool } from "pg";
import { IEmailRepository } from "../Interfaces/IEmailSender";
import { IOneTimePasswordRepository } from "../Interfaces/IOneTimePassword";
import { InvalidArgumentError } from "../Errors/InvalidArgumentError";
import { randomBytes } from "node:crypto";
import * as argon2 from "argon2";



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

    generate(): string {
        return randomBytes(3).toString("hex").toUpperCase().slice(0, 5);
    }

    async save(email: string, otp: string, signal?: AbortSignal): Promise<void> {
        const hashedOtp = await argon2.hash(otp);

        // set expires_at to 5 mins
        const expires_at = new Date();
        expires_at.setMinutes(expires_at.getMinutes() + 5);

        await this.pool.query(`
            INSERT INTO otp_session ()
            `)
    }
}