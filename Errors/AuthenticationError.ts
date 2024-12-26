export class AuthenticationError extends Error {
    constructor(message: string, public code: number) {
        super(message);
        if (code === 401) {
            this.name = "AuthenticationError";
        }

        if (code === 403) {
            this.name = "AuthorizationError";
        }
    }
}