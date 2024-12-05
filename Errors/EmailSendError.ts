export class EmailSendError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EmailSendError";
    }
}