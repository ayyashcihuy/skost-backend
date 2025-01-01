import { Pool } from "pg";
import { IAuth } from "../Interfaces/IAuth";
import { AuthenticationError } from "../Errors/AuthenticationError";
import * as argon from "argon2";
import { config } from "../config/secrets";
import { signToken, verifyToken } from "../Services/JWTService";
import { JwtPayload } from "jsonwebtoken";

export default class AuthenticationRepository implements IAuth {
    private readonly pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    public async refresh(token: string): Promise<{ accessToken: string; refreshToken: string; }> {
        try {
            const payload = verifyToken(token) as JwtPayload;

            if (payload.email == null) {
                throw new AuthenticationError("Invalid Refresh Token", 401);
            }

            const email = payload.email;

            const query = `
                SELECT email FROM customers WHERE email = $1;
            `

            const user = await this.pool.query(query, [email]);

            if (user.rowCount === 0) {
                throw new AuthenticationError("Invalid Credentials", 401);
            }

            const accessToken = signToken(user.rows[0].email, config.jwt.expires_in);
            const refreshToken = signToken(user.rows[0].email, config.jwt.refresh_expires_in);

            return {
                accessToken,
                refreshToken
            }
        } catch (err) {
            throw new AuthenticationError(`Invalid Refresh Token: ${err} `, 401);
        }
    }

    public async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
        try {
            const query = `
                SELECT email, password FROM customers WHERE email = $1;
            `

            const user = await this.pool.query(query, [email]);

            if (user.rowCount === 0) {
                throw new AuthenticationError("Invalid Credentials", 401);
            }

            const passwordMatch = await argon.verify(password, user.rows[0].password);

            if (!passwordMatch) {
                throw new AuthenticationError("Invalid Credentials", 401);
            }

            const accessToken = signToken(user.rows[0].email, config.jwt.expires_in);
            const refreshToken = signToken(user.rows[0].email, config.jwt.refresh_expires_in);

            return {
                accessToken,
                refreshToken
            }
        } catch (err) {
            throw new AuthenticationError(`Invalid Credentials: ${err} `, 401);
        }
    }
}