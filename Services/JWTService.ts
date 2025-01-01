import jwt, { JwtPayload } from "jsonwebtoken";
import { privateKey, publicKey } from "../config/key";
import { AuthenticationError } from "../Errors/AuthenticationError";

export const signToken = (email: string, expires_in: string) => {
    return jwt.sign({ email }, privateKey, { algorithm: "RS256", expiresIn: expires_in });
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, publicKey) as JwtPayload;
    } catch (err) {
        throw new AuthenticationError(`Invalid Token: ${err}`, 401);
    }
}